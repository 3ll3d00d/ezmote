import {findItemByName, safeGetText} from "./functions";

const converter = (json) => {
    if (json.hasOwnProperty('MPL')) {
        if (json.MPL.hasOwnProperty('Item')) {
            const values = json.MPL.Item.map(item => {
                return {
                    id: safeGetText(item.Field.find(findItemByName('Key'))),
                    name: safeGetText(item.Field.find(findItemByName('Name')))
                };
            });
            return values;
        }
    } else if (json.hasOwnProperty('Response')) {
        if (json.Response._attributes.Status === 'OK') {
            return true;
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'BROWSE_FILES',
    path: 'MCWS/v1/Browse/Files',
    requiredParams: ['ID', 'Action'],
    converter
};

export default (config, nodeId, action = 'Play') => Object.assign({}, {
    suppliedParams: {
        ID: nodeId,
        Action: action
    }
}, {config}, endpoint);