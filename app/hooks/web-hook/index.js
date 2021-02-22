import { config } from 'config';
import http from 'http';

const pushStartUp =async (data) => {
    const dataString = JSON.stringify(data);
    try {
        const result = await http.post(config().HOOK_URL_START_UP, dataString);
        console.info(`[WEB-HOOK] Successfully called webhook`);
        return result;
    } catch (e) {
        console.error(`[WEB-HOOK] Tried to request ${ config().HOOK_URL_START_UP }`, e);
    }

    return false;
}
const pushShutdown = () => {

}
const data = JSON.stringify({
    todo: 'Buy the milk'
})

const req = http.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
        process.stdout.write(d)
    })
})

req.on('error', error => {
    console.error(error)
})

req.write(data)
req.end()

export const beforeInstall = ( ) => {
}

export const afterInstall = ( ) => {

}
export const seleniumStart = async (req, res) => {
    throw new Error("[HOOK-ISSUE] No Engine was selected - called Interface")
}

export const sessionCreated = (req, res, session) => {
    throw new Error("[HOOK-ISSUE] No Engine was selected - called Interface")
}

export const sessionRequest = (req, res) => {
    throw new Error("[HOOK-ISSUE] No Engine was selected - called Interface")
}

export const sessionDeleted = (req, res) => {
    throw new Error("[HOOK-ISSUE] No Engine was selected - called Interface")
}
