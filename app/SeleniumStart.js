const selenium = require('selenium-standalone');
let seleniumServer = null;

export const start = (port, callback) => {
    selenium.start({
        // check for more recent versions of selenium here:
        // https://selenium-release.storage.googleapis.com/index.html
        version: '3.141.59',
        baseURL: 'https://selenium-release.storage.googleapis.com',
        drivers: {
            chrome: {
                // check for more recent versions of chrome driver here:
                // https://chromedriver.storage.googleapis.com/index.html
                version: '87.0.4280.20',
                arch: process.arch,
                baseURL: 'https://chromedriver.storage.googleapis.com'
            },
            ie: {
                // check for more recent versions of internet explorer driver here:
                // https://selenium-release.storage.googleapis.com/index.html
                version: '3.150.0',
                arch: process.arch,
                baseURL: 'https://selenium-release.storage.googleapis.com'
            }
        },
        ignoreExtraDrivers: true,
        requestOpts: { // see https://www.npmjs.com/package/got
            timeout: 10000
        },
        logger: function(message) {
            console.log(message);
        },
        progressCb: function(totalLength, progressLength, chunkLength) {

        },
        seleniumArgs: ['-port' ,port]
    }, (statusText, selenium) => {
        seleniumServer = selenium;
        callback(statusText, selenium)
    });
}
export const stop = (callback) => {
    seleniumServer.kill('SIGINT');
}
export const install = (callback) => {

    selenium.install({
        // check for more recent versions of selenium here:
        // https://selenium-release.storage.googleapis.com/index.html
        version: '3.141.59',
        baseURL: 'https://selenium-release.storage.googleapis.com',
        drivers: {
            chrome: {
                // check for more recent versions of chrome driver here:
                // https://chromedriver.storage.googleapis.com/index.html
                version: '87.0.4280.20',
                arch: process.arch,
                baseURL: 'https://chromedriver.storage.googleapis.com'
            },
            ie: {
                // check for more recent versions of internet explorer driver here:
                // https://selenium-release.storage.googleapis.com/index.html
                version: '3.150.0',
                arch: process.arch,
                baseURL: 'https://selenium-release.storage.googleapis.com'
            }
        },
        ignoreExtraDrivers: true,
        requestOpts: { // see https://www.npmjs.com/package/got
            timeout: 10000
        },
        logger: function(message) {
            console.log(message);
        },
        progressCb: function(totalLength, progressLength, chunkLength) {

        }
    }, callback);
}
