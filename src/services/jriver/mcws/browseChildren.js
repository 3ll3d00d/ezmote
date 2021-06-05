const PLAY_TYPE_FILE = 'file';
const PLAY_TYPE_BROWSE = 'browse';

const convert = (item) => {
    return {
        id: item._text,
        name: item._attributes.Name
    };
};

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        if (json.Response.hasOwnProperty('Item')) {
            if (Array.isArray(json.Response.Item)) {
                return json.Response.Item.map(item => convert(item));
            } else {
                return [convert(json.Response.Item)];
            }
        } else {
            return [];
        }
    } else {
        throw new Error(`Bad response ${JSON.stringify(json)}`)
    }
};

const withType = (type) => {
    return (json) => converter(json).map(c => {
        return Object.assign({type}, c);
    });
};

const playableChildren = withType(PLAY_TYPE_FILE);
const browseableChildren = withType(PLAY_TYPE_BROWSE);

const endpoint = {
    name: 'BROWSE_CHILDREN',
    path: 'MCWS/v1/Browse/Children',
    requiredParams: ['ID']
};

const make = (converter) => (serverURL, nodeId) => Object.assign({}, {suppliedParams: {ID: nodeId}}, {serverURL}, Object.assign({converter}, endpoint));
const playable = make(playableChildren);
const browseable = make(browseableChildren);

export {
    playable,
    browseable,
    PLAY_TYPE_BROWSE,
    PLAY_TYPE_FILE
}