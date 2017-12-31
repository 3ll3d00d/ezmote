import {findItemByName, safeGetText} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
        return {
            serverName: safeGetText(json.Response.Item.find(findItemByName('FriendlyName'))),
            version: safeGetText(json.Response.Item.find(findItemByName('ProgramVersion'))),
            pingTime: new Date().getTime()
        };
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'ALIVE',
    path: 'MCWS/v1/Alive',
    requiredParams: [],
    converter
};

export default config => Object.assign({}, {config}, endpoint);
