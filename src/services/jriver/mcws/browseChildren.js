import {safeGetNumber, safeGetText} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        if (json.Response.hasOwnProperty('Item')) {
            return json.Response.Item.map(item => {
                return {
                    id: item._text,
                    name: item._attributes.Name
                };
            });
        } else {
            return [];
        }
    } else {
        throw new Error(`Bad response ${JSON.stringify(json)}`)
    }
};

const endpoint = {
    name: 'BROWSE_CHILDREN',
    path: 'MCWS/v1/Browse/Children',
    requiredParams: ['ID'],
    converter
};

export default (config, nodeId) => Object.assign({}, {suppliedParams: {ID: nodeId}}, {config}, endpoint);