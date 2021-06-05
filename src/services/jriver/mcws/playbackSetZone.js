const converter = (zoneId) => (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return {
            zoneId: zoneId,
            status: true
        };
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'SET_ZONE',
    path: 'MCWS/v1/Playback/SetZone',
    requiredParams: ['Zone'],
};

export default (serverURL, zoneId) => Object.assign({}, {suppliedParams: {Zone: zoneId}}, {serverURL}, Object.assign(endpoint, {converter: converter(zoneId)}));
