import {safeGetText} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
        const tokenTime = new Date().getTime();
        let token = null;
        // let readOnly = false;
        if (Array.isArray(json.Response.Item)) {
            // let readonly = false;
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
        } else if (json.Response.Item._attributes.Name && json.Response.Item._attributes.Name === 'Token') {
            token = safeGetText(json.Response.Item);
        } else {
            throw new Error(`Unexpected response from MUTE, no State received ${JSON.stringify(json)}`);
        }
        if (token) {
            return {token, tokenTime};
        } else {
            throw new Error(`No token delivered by authenticate - ${JSON.stringify(json)}`)
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
