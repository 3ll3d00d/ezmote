import {safeGetText} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
        if (Array.isArray(json.Response.Item)) {
            throw new Error(`Unexpected response from AUTH, many Items received ${JSON.stringify(json)}`);
        } else if (json.Response.Item._attributes.Name && json.Response.Item._attributes.Name === 'Token') {
            return {
                token: safeGetText(json.Response.Item),
                tokenTime: new Date().getTime()
            };
        } else {
            throw new Error(`Unexpected response from MUTE, no State received ${JSON.stringify(json)}`);
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'AUTH',
    path: 'MCWS/v1/Authenticate',
    requiredParams: [],
    converter
};

export default config => Object.assign({}, {config}, endpoint);
