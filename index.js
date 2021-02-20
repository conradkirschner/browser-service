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
            seleniumInstances.push({quota: result.value, exec: req.seleniumServerInstance});
        });

    }
    const session = sessionCheck(req.url.split('/')[4]);
    if (session ) {
        if (req.url === `/wd/hub/session/${session.quota.sessionId}` && req.method === 'DELETE') {
            console.info("[SHUTDOWN-SELENIUM]")
        }
    }

});
const sessionCheck = (sessionId) => {
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
    if (req.url === '/wd/hub/session') {


        console.info("[START-UP] STARTING SELENIUM")
        const seleniumServerInstance =  await new Promise((resolve, reject) => {
                seleniumServer.start((error, selenium) => {
                    resolve(selenium)
                });
            })
        req.seleniumServerInstance = seleniumServerInstance;
    }
    console.info("[ROUTER] Routing to Selenium Instance")

    return {
        req,
        res,
        next: (req, res) => proxy.web(req, res, {target: 'http://127.0.0.1:4444'})
    }

}
console.log("http://127.0.0.1:3001")
loadbalancer.listen(3001);
