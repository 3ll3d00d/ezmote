import {findItemByName, safeGetNumber} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
        const level = safeGetNumber(json.Response.Item.find(findItemByName('Level')));
        if (level) {
            return level;
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'SET_VOLUME',
    path: 'MCWS/v1/Playback/Volume',
    requiredParams: ['Level', 'Zone'],
    converter
};

export default (serverURL, zoneId, level) => Object.assign({}, {
    suppliedParams: {
        Zone: zoneId,
        Level: level
    }
}, {serverURL}, endpoint);
