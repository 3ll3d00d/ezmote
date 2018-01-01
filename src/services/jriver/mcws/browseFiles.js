const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return true;
    } else {
        throw new Error(`Bad response ${JSON.stringify(json)}`)
    }
};

const endpoint = {
    name: 'BROWSE_FILES',
    path: 'MCWS/v1/Browse/Files',
    requiredParams: ['ID', 'Action'],
    converter
};

export default (config, nodeId) => Object.assign({}, {suppliedParams: {ID: nodeId, Action: 'Play'}}, {config}, endpoint);