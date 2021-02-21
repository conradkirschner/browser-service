import * as SeleniumStandalone from "./hooks/seleniumStandalone";
const seleniumServer = require('./SeleniumStart')

const selectedEngine = process.env.SPAWN_ENGINE;
let engine = SeleniumStandalone;

switch (selectedEngine) {
    case 'standalone':
        engine = SeleniumStandalone;
        break;
    case 'kubernetes':
        engine = SeleniumStandalone;
        break;
    default:
        engine = SeleniumStandalone;
}
export const beforeInstall = ( ) => {
    engine.beforeInstall();
}
export const afterInstall = ( ) => {
    engine.afterInstall();
}
export const seleniumStart = async (req, res) => {
    return await engine.seleniumStart(req, res);
}

export const sessionCreated = (req, res, session) => {
    return engine.sessionCreated();

}

export const sessionRequest = (req, res) => {
    return engine.sessionRequest();

}

export const sessionDeleted = (req, res) => {
    return engine.sessionDeleted();

}
