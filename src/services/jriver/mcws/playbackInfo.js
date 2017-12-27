import {findItemByName, safeGetNumber, safeGetText} from "./functions";

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        const volumeDisplay = safeGetText(json.Response.Item.find(findItemByName('VolumeDisplay')));
        return {
            id: safeGetText(json.Response.Item.find(findItemByName('ZoneID'))),
            name: safeGetText(json.Response.Item.find(findItemByName('ZoneName'))),
            volumeRatio: safeGetNumber(json.Response.Item.find(findItemByName('Volume'))),
            muted: isMuted(volumeDisplay),
            volumedb: extractVolumedB(volumeDisplay),
            fileKey: safeGetText(json.Response.Item.find(findItemByName('FileKey'))),
            imageURL: safeGetText(json.Response.Item.find(findItemByName('ImageURL'))),
            status: safeGetText(json.Response.Item.find(findItemByName('Status')))
        }
    } else {
        throw new Error(`Bad response ${JSON.stringify(json)}`)
    }
};

const isMuted = (text) => {
    return 'Muted' === text;
};

const extractVolumedB = (text) => {
    if (text) {
        if (text === 'Muted') {
            return -100;
        } else {
            const pattern = /.*\((-[0-9]+\.[0-9]) dB\)/;
            const match = pattern.exec(text);
            if (match) {
                return Number(match[1]);
            } else {
                console.warn(`Unknown value received from VolumeDisplay ${text}`);
                return -100;
            }
        }
    } else {
        return -100;
    }
};

const endpoint = {
    name: 'GET_ZONE_INFO',
    path: 'MCWS/v1/Playback/Info',
    requiredParams: ['Zone'],
    converter
};

export default (config, zoneId) => Object.assign({}, {suppliedParams: {Zone: zoneId}}, {config}, endpoint);