const converter = (json) => {
    return {};
};

const endpoint = {
    name: 'ALIVE',
    path: 'MCWS/v1/Alive',
    requiredParams: [],
    converter
};

export default config => Object.assign({}, endpoint, {config});
