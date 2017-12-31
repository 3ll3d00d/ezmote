const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return true;
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'STOP',
    path: 'MCWS/v1/Playback/Stop',
    requiredParams: ['Zone'],
    converter
};

export default (config, zoneId) => Object.assign({}, {suppliedParams: {Zone: zoneId}}, {config}, endpoint);
