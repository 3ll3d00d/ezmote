const converter = (json) => {
    if (json.hasOwnProperty('Response')) {
        if (json.Response._attributes.Status === 'OK') {
            return true;
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'FILE_GET_INFO',
    path: 'MCWS/v1/File/GetInfo',
    requiredParams: ['File', 'Action'],
    converter
};

export default (serverURL, fileKey) => Object.assign({}, {
    suppliedParams: {
        File: fileKey,
        Action: 'Play'
    }
}, {serverURL}, endpoint);