import {safeGetText} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
        if (Array.isArray(json.Response.Item)) {
            let token = null;
            let readonly = false;
            json.Response.Item.forEach(item => {
                switch (item._attributes.Name) {
                    case 'Token':
                        token = safeGetText(item);
                        break;
                    case 'ReadOnly':
                        // TODO handle
                        break;
                    default:
                        // ignore
                }
            });
            if (token) {
                return {
                    token,
                    tokenTime: new Date().getTime()
                };
            } else {
                throw new Error(`No token in authenticate response ${JSON.stringify(json)}`)
            }
        } else if (json.Response.Item._attributes.Name && json.Response.Item._attributes.Name === 'Token') {
            // TODO check if ReadOnly is false or not present
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
