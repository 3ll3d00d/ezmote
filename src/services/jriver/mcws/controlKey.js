const converter = (json) => {
    if (json.hasOwnProperty('Response')) {
        if (json.Response._attributes.Status === 'OK') {
            return true;
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'CONTROL_KEY',
    path: 'MCWS/v1/Control/Key',
    requiredParams: ['Key', 'Focus'],
    converter
};

export default (config, keys) => Object.assign({}, {
    suppliedParams: {
        Key: keys.join(';'),
        Focus: '1'
    }
}, {config}, endpoint);