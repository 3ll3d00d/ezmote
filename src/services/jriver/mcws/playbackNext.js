const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return true;
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'NEXT',
    path: 'MCWS/v1/Playback/Next',
    requiredParams: ['Zone'],
    converter
};

export default (serverURL, zoneId) => Object.assign({}, {suppliedParams: {Zone: zoneId}}, {serverURL}, endpoint);
