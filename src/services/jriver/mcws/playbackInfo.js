import {safeGetNumber, safeGetText} from "./functions";

export const STOPPED = 'Stopped';
export const PLAYING = 'Playing';

const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        let val = {active: true, playingNow: {}};
        let hasName = false;
        json.Response.Item.forEach(item => {
            switch (item._attributes.Name) {
                case 'ZoneID':
                    val.id = safeGetText(item);
                    break;
                case 'ZoneName':
                    val.name = safeGetText(item);
                    break;
                case 'Volume':
                    val.volumeRatio = safeGetNumber(item);
                    break;
                case 'VolumeDisplay':
                    const txt = safeGetText(item);
                    val.muted = isMuted(txt);
                    val.volumedb = extractVolumedB(txt);
                    break;
                case 'State':
                    const state = safeGetNumber(item);
                    switch (state) {
                        case 0:
                            val.playingNow.status = STOPPED;
                            break;
                        case 1:
                            val.playingNow.status = 'Paused';
                            break;
                        case 2:
                            val.playingNow.status = PLAYING;
                            break;
                        default:
                            val.playingNow.status = 'Unknown';
                    }
                    break;
                case 'FileKey':
                    val.playingNow.fileKey = safeGetText(item);
                    break;
                case 'ImageURL':
                    val.playingNow.imageURL = safeGetText(item);
                    break;
                case 'PositionMS':
                    val.playingNow.positionMillis = safeGetNumber(item);
                    break;
                case 'DurationMS':
                    val.playingNow.durationMillis = safeGetNumber(item);
                    break;
                case 'PlayingNowPositionDisplay':
                    val.playingNow.positionDisplay = safeGetText(item);
                    break;
                case 'Artist':
                    val.playingNow.artist = safeGetText(item);
                    break;
                case 'Album':
                    val.playingNow.album = safeGetText(item);
                    break;
                case 'Name':
                    val.playingNow.name = safeGetText(item);
                    val.playingNow.externalSource = val.playingNow.name && val.playingNow.name === 'Ipc';
                    hasName = true;
                    break;
                default:
                    // ignore
            }
        });
        if (!hasName) {
            val.playingNow.externalSource = false;
        }
        return val;
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
        } else if (text === '100%') {
            return 0;
        } else {
            const pattern = /.*\(([-+][0-9]+\.[0-9]) dB\)/;
            const match = pattern.exec(text);
            if (match) {
                return Number(match[1]);
            } else {
                // TODO handle % values
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