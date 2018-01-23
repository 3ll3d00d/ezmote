import _ from 'lodash';

const zone = (id, name) => {
    return {id, name};
};

const withActive = (zone) => {
    return Object.assign({active: true}, zone);
};

const enriched = (enriched, zone) => {
    return Object.assign({}, enriched, zone);
};

const zones = (...zones) => {
    return {
        zones: _.keyBy(zones, 'id')
    }
};

const enrichedData = {
    volumeRatio: 0.31,
    volumedb: -31,
    fileKey: '123456',
    imageURL: 'URL 1234'
};

export {
    zone, withActive, enriched, zones, enrichedData
}
