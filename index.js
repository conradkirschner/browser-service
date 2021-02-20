const seleniumServer = require('./SeleniumStart')
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
            seleniumInstances.push({ quota: result.value, exec: req.seleniumServerInstance, port: req.seleniumServerPort });
        });

    }
    const session = getSession(getSessionId(req));
    if (session ) {
        if (req.url === `/wd/hub/session/${session.quota.sessionId}` && req.method === 'DELETE') {
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
const router = async (req,res) => {
    let port;
    if (req.url === '/wd/hub/session') {
        port = Math.floor(Math.random()*1000)
        console.info("[START-UP] STARTING SELENIUM ON Port:", port)
        const seleniumServerInstance =  await new Promise((resolve, reject) => {
                seleniumServer.start(port, (error, selenium) => {
                    resolve(selenium)
                });
            })
        req.seleniumServerInstance = seleniumServerInstance;
        req.seleniumServerPort = port;
    }
    const session = getSession(getSessionId(req));
    if (session) {
        port = session.port;
    }
    console.info("[ROUTER] Routing to Selenium Instance", port)

    return {
        req,
        res,
        next: (req, res) => proxy.web(req, res, {target: 'http://127.0.0.1:' + port})
    }

}
console.log("http://127.0.0.1:3001")
loadbalancer.listen(3001);
