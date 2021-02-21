const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromCluster();

export const beforeInstall = ( ) => {
 }
export const afterInstall = ( ) => {

}
export const seleniumStart = async (req, res) => {

    // @TODO Start pod and receive url
    req.seleniumServerInstance = seleniumServerInstance;
    req.seleniumServerLocation = process.env.LOADBALANCER_HOST;
    req.seleniumServerPort = port;
    return {req, res}
}

export const sessionCreated = (req, res, session) => {

}

export const sessionRequest = (req, res) => {

}

export const sessionDeleted = (req, res) => {

}
