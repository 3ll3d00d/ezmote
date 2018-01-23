import {findItemByName, safeGetText} from "./functions";
import {PLAY_TYPE_FILE} from "./browseChildren";

const playConverter = (json) => {
    if (json.hasOwnProperty('Response')) {
        if (json.Response._attributes.Status === 'OK') {
            return true;
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const playEndpoint = {
    name: 'BROWSE_FILES',
    path: 'MCWS/v1/Browse/Files',
    requiredParams: ['ID', 'Action'],
    converter: playConverter
};

const convert = (item) => {
    return {
        type: PLAY_TYPE_FILE,
        id: safeGetText(item.Field.find(findItemByName('Key'))),
        name: safeGetText(item.Field.find(findItemByName('Name')))
    };
};

const browseConverter = (json) => {
    if (json.hasOwnProperty('MPL')) {
        if (json.MPL.hasOwnProperty('Item')) {
            if (Array.isArray(json.MPL.Item)) {
                return json.MPL.Item.map(item => convert(item));
            } else {
                return [convert(json.MPL.Item)];
            }
        } else {
            return [];
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const browseEndpoint = {
    name: 'BROWSE_FILES',
    path: 'MCWS/v1/Browse/Files',
    requiredParams: ['ID', 'Action', 'Fields'],
    converter: browseConverter
};

export const playBrowse = (config, nodeId) => Object.assign({}, {
    suppliedParams: {
        ID: nodeId,
        Action: 'Play'
    }
}, {config}, playEndpoint);

export const browseFiles = (config, nodeId) => Object.assign({}, {
    suppliedParams: {
        ID: nodeId,
        Action: 'MPL',
        Fields: 'Key,Name'
    }
}, {config}, browseEndpoint);