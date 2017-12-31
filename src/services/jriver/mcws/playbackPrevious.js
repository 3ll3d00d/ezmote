const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return true;
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'PREVIOUS',
    path: 'MCWS/v1/Playback/Previous',
    requiredParams: ['Zone'],
    converter
};

export default (config, zoneId) => Object.assign({}, {suppliedParams: {Zone: zoneId}}, {config}, endpoint);
