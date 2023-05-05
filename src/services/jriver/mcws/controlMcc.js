import {safeGetNumber} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return true;
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'MCC',
    path: 'MCWS/v1/Control/MCC',
    requiredParams: ['Command', 'Parameter', 'Block', 'Zone'],
    converter
};

export default (serverURL, zoneId, command, parameter, block) => Object.assign({}, {
    suppliedParams: {
        Block: block ? 1 : 0,
        Zone: zoneId,
        Command: command,
        Parameter: parameter
    }
}, {serverURL}, endpoint);
