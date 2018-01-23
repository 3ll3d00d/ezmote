const converter = (zoneId) => (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return {
            zoneId,
            status: true
        };
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'STOP',
    path: 'MCWS/v1/Playback/Stop',
    requiredParams: ['Zone']
};

export default (config, zoneId) => Object.assign({}, {suppliedParams: {Zone: zoneId}}, {config}, Object.assign(endpoint, {converter: converter(zoneId)}));
