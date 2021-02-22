const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromCluster();

// Install special 
export const beforeInstall = ( ) => {
 }
export const afterInstall = ( ) => {

}
// @TODO Implement Session Start functionallity
export const seleniumStart = async (req, res) => {

    // @TODO 1. Start browser pod
    // @TODO 2. send back url to browser pod and port
    // @TODO 3. send back seleniumServerInstance ( to kill it later, when something goes wrong)

    req.seleniumServerInstance = seleniumServerInstance;
    req.seleniumServerLocation = process.env.LOADBALANCER_HOST;
    req.seleniumServerPort = port;
    return {req, res}
}
// @TODO Implement Session Created functionallity
export const sessionCreated = (req, res, session) => {

    // @TODO 1. This is triggered once the session was successfully created and we are on the way to the tests 

}
// @TODO Implement Session Request functionallity
export const sessionRequest = (req, res) => {
 // here you could intercept the session requests

}
// @TODO Implement Session Delete functionallity
export const sessionDeleted = (req, res) => {
    // @TODO 1. Delete Browser Pod
    // @TODO 2. send back success response

}
