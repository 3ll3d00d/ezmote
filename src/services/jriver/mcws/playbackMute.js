const converter = (json) => {
    return {};
};

const endpoint = {
    name: 'MUTE',
    path: 'MCWS/v1/Playback/Mute',
    requiredParams: ['Set', 'Zone'],
    converter
};

export default (config, mute, zoneId) => Object.assign({}, {config}, {
    suppliedParams: {
        Set: mute ? 1 : 0,
        Zone: zoneId
    }
}, ...endpoint);
