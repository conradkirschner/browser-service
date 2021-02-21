// Load Engine to activate Hooks
import {selectEngine} from "./engineLoader";

const engine = selectEngine();

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
