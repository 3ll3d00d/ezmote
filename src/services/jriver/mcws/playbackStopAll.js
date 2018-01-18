const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        return true;
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const endpoint = {
    name: 'STOP_ALL',
    path: 'MCWS/v1/Playback/StopAll',
    converter
};

export default (config) => Object.assign({}, {config}, endpoint);
