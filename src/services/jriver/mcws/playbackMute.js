import {safeGetNumber} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
        if (Array.isArray(json.Response.Item)) {
            throw new Error(`Unexpected response from MUTE, many Items received ${JSON.stringify(json)}`);
        } else if (json.Response.Item._attributes.Name && json.Response.Item._attributes.Name === 'State') {
            const level = safeGetNumber(json.Response.Item);
            return !!level;
        } else {
            throw new Error(`Unexpected response from MUTE, no State received ${JSON.stringify(json)}`);
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'MUTE',
    path: 'MCWS/v1/Playback/Mute',
    requiredParams: ['Set', 'Zone'],
    converter
};

export default (config, zoneId, mute) => Object.assign({}, {
    suppliedParams: {
        Set: mute ? 1 : 0,
        Zone: zoneId
    }
}, {config}, endpoint);
