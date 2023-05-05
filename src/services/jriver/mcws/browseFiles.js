import {PLAY_TYPE_FILE} from "./browseChildren";

const playConverter = (json) => {
    if (json.hasOwnProperty('Response')) {
        if (json.Response._attributes.Status === 'OK') {
            return true;
        }
    }
    throw new Error(`Bad response ${JSON.stringify(json)}`)
};

const playEndpoint = {
    name: 'BROWSE_FILES',
    path: 'MCWS/v1/Browse/Files',
    requiredParams: ['ID', 'Action'],
    converter: playConverter
};

const toRez = dims => {
    if (dims) {
        if (dims === '1920 x 1080') {
            return 'HD';
        } else if (dims === '3840 x 2160') {
            return 'UHD';
        } else {
            return 'DVD';
        }
    }
    return null;
}

const browseConverter = (json) => {
    return json.map(j => {
        return {
            type: PLAY_TYPE_FILE,
            id: j.Key,
            name: j.Name,
            duration: j.Duration,
            dims: j.Dimensions,
            rez: toRez(j.Dimensions),
            year: j['Date (year)'],
            mediaType: j['Media Type'],
            mediaSubType: j['Media Sub Type'],
            season: j.Season,
            episode: j.Episode,
            artist: j.Artist,
            lastPlayed: j['Last Played'],
            cropAR: Number.parseFloat(j.CropAR).toFixed(2),
            hdrFormat: j['HDR Format'],
            audioChannels: j['Audio Channels']
        }
    });
};

const browseEndpoint = {
    name: 'BROWSE_FILES',
    path: 'MCWS/v1/Browse/Files',
    requiredParams: ['ID', 'Action', 'Fields'],
    converter: browseConverter
};

export const playBrowse = (serverURL, nodeId) => Object.assign({}, {
    suppliedParams: {
        ID: nodeId,
        Action: 'Play'
    }
}, {serverURL}, playEndpoint);

export const browseFiles = (serverURL, nodeId) => Object.assign({}, {
    suppliedParams: {
        ID: nodeId,
        Action: 'JSON',
        Fields: 'Key,Name,Duration,Dimensions,Season,Episode,Year,Media Type,Media Sub Type,Artist,Last Played,CropAR,HDR Format,Audio Channels'
    }
}, {serverURL}, browseEndpoint);