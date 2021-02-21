const seleniumServer = require('../../SeleniumStart')

export const beforeInstall = ( ) => {
    seleniumServer.install((error) => {if(error){console.error(error)}});
}
export const afterInstall = ( ) => {

}
export const seleniumStart = async (req, res) => {

    const port = Math.floor(Math.floor(Math.random() * 100) + 1000)
    console.info("[START-UP] STARTING SELENIUM ON Port:", port)

    const seleniumServerInstance =  await new Promise((resolve, reject) => {
        seleniumServer.start(port, (error, selenium) => {
            if (error) {
                console.error("[SELENIUM-SERVER] ERROR", error);

            }
            resolve(selenium)
        });
    });
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
