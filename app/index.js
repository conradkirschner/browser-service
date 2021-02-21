import dotenv from 'dotenv/config';
import {afterInstall, beforeInstall, seleniumStart, sessionCreated, sessionDeleted, sessionRequest} from "./engine/hookRegister";

if (process.env.INSTALL_DRIVER === 'true') {
    beforeInstall();
    afterInstall();

}
const http = require('http'),
    httpProxy = require('http-proxy');

const seleniumInstances = [];

const proxy = httpProxy.createProxyServer({});
const loadbalancer = http.createServer(async function (req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    const route = await router(req, res);
    route.next(route.req, route.res);
});
const getSessionId = (req) => {
    return req.url.split('/')[4];
}
proxy.on('proxyRes', function (proxyRes, req, res) {

    if (req.url === '/wd/hub/session') {
        let body = [];
        proxyRes.on('data', function (chunk) {
            body.push(chunk);
        });
        proxyRes.on('end', function () {
            if (res.method === 'DELETE') {

                return;
            }
            body = Buffer.concat(body).toString();
            const result = JSON.parse(body);
            sessionCreated(req,res, session);
            seleniumInstances.push({ quota: result.value, exec: req.seleniumServerInstance, port: req.seleniumServerPort });
        });

    }
    const session = getSession(getSessionId(req));
    if (session ) {
        if (req.url === `/wd/hub/session/${session.quota.sessionId}` && req.method === 'DELETE') {
            sessionDeleted(req,res);
            console.info("[SHUTDOWN-SELENIUM]" , session.port)
        }
    }

});
const getSession = (sessionId) => {
    if (!sessionId) return null;
    for (let i = 0, len = seleniumInstances.length; i < len; i++ ) {
        const currentInstance = seleniumInstances[i];
        if (sessionId === currentInstance.quota.sessionId) {
            return currentInstance;
        }
    }
    return null;
}
const router = async (req, res) => {
    let seleniumLocation = process.env.LOADBALANCER_HOST;
    if (req.url === '/wd/hub/session') {
        const result = await seleniumStart(req, res);
        req = result.req;
        res = result.res;
        seleniumLocation =  req.seleniumServerLocation;
    }
    const session = getSession(getSessionId(req));
    if (session) {
        req.seleniumServerPort = session.port;
    }
    console.info("[ROUTER] Routing to Selenium Instance", req.seleniumServerPort )
    sessionRequest(req,res);
    return {
        req,
        res,
        next: (req, res) => proxy.web(req, res, {target: `http://${seleniumLocation}:${req.seleniumServerPort }`})
    }

}
console.info(`[PORT]  ${process.env.LOADBALANCER_PORT}`)
loadbalancer.listen( process.env.LOADBALANCER_PORT);
