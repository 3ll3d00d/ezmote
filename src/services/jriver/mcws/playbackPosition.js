import {safeGetNumber} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
        if (Array.isArray(json.Response.Item)) {
            throw new Error(`Unexpected response from SET_POSITION, many Items received ${JSON.stringify(json)}`);
        } else if (json.Response.Item._attributes.Name && json.Response.Item._attributes.Name === 'Position') {
            return safeGetNumber(json.Response.Item);
        } else {
            throw new Error(`Unexpected response from SET_POSITION, no Position received ${JSON.stringify(json)}`);
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'SET_POSITION',
    path: 'MCWS/v1/Playback/Position',
    requiredParams: ['Position', 'Zone', 'Relative'],
    converter
};

export default (serverURL, zoneId, position, direction) => Object.assign({}, {
    suppliedParams: {
        Zone: zoneId,
        Position: position,
        Relative: direction
    }
}, {serverURL}, endpoint);
