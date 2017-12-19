import {xml2js} from 'xml-js';
import base64 from 'base-64';

const ENDPOINTS = {
    'GET_ZONES': {path: '/MCWS/v1/Playback/Zones', params: []},
    'GET_ZONE_INFO': {path: '/MCWS/v1/Playback/Info', params: ['Zone']}
};

const COMPACT = {compact: true, ignoreDeclaration: true};

/**
 * Encapsulates any calls to MCWS.
 */
class JRiverService {
    getParams = (paramKeys, paramValues) => {
        const esc = encodeURIComponent;
        return paramKeys.map((k, i) => esc(k) + '=' + esc(paramValues[i])).join('&');
    };

    getUrl = (url, target, params = []) => {
        if (ENDPOINTS.hasOwnProperty(target)) {
            if (params.length > 0) {
                // TODO check both vals and keys are same length or use an object instead
                return `${url}/${ENDPOINTS[target].path}?${this.getParams(ENDPOINTS[target].params, params)}`;
            } else {
                return `${url}/${ENDPOINTS[target].path}`;
            }
        }
        throw `Unknown target - ${target}`;
    };

    getAuthHeader = (username, password) => {
        return {
            Authorization: 'Basic ' + base64.encode(username + ":" + password)
        };
    };

    /**
     * Gets basic information about all zones.
     * @returns {Promise<void>}
     */
    getZones = async (url, username, password) => {
        return this._getMCWS({url, username, password, target: 'GET_ZONES', converter: this.extractZones});
    };

    /**
     * converts the raw zone information to a more js like format.
     * @param json the json
     */
    extractZones = (json) => {
        if (json.Response._attributes.Status === 'OK') {
            const zones = new Map();
            let activeZoneId;
            // iterate over the items rather than search for zones one by one (to avoid repeatedly searching a map)
            json.Response.Item.forEach(item => {
                const itemName = item._attributes.Name;
                let itemIdx;
                let zone = {};
                if (itemName.startsWith('ZoneName')) {
                    itemIdx = itemName.substr(8);
                    zone = Object.assign(zone, {name: item._text});
                } else if (itemName.startsWith('ZoneID')) {
                    itemIdx = itemName.substr(6);
                    zone = Object.assign(zone, {id: item._text});
                } else if (itemName === 'CurrentZoneID') {
                    activeZoneId = item._text;
                }
                if (itemIdx) {
                    let storedZone = zones.get(itemIdx);
                    if (storedZone) {
                        storedZone = Object.assign(storedZone, zone);
                    } else {
                        storedZone = zone;
                    }
                    zones.set(itemIdx, storedZone);
                }
            });
            return Array.from(zones.values())
                        .map(z => Object.assign(z, {active: activeZoneId && z.id === activeZoneId}));
        } else {
            // TODO report error?
            return [];
        }
    };

    /**
     * Gets detailed information about a particular zone.
     * @param username the username.
     * @param password the password.
     * @param zoneId the zoneId.
     * @returns {Promise<{volume, volumedb, fileKey, imageURL}>}
     */
    getZoneInfo = async (url, username, password, zoneId) => {
        return this._getMCWS({
            url,
            username,
            password,
            target: 'GET_ZONE_INFO',
            params: [zoneId],
            converter: this.extractZoneInfo
        });
    };

    extractZoneInfo = (json) => {
        if (json.Response._attributes.Status === 'OK') {
            return {
                id: json.Response.Item.find(this.findByName('ZoneID'))._text,
                name: json.Response.Item.find(this.findByName('ZoneName'))._text,
                volumeRatio: Number(json.Response.Item.find(this.findByName('Volume'))._text),
                volumedb: Number(this.extractVolumedB(json.Response.Item.find(this.findByName('VolumeDisplay'))._text)),
                fileKey: json.Response.Item.find(this.findByName('FileKey'))._text,
                imageURL: json.Response.Item.find(this.findByName('ImageURL'))._text
            }
        } else {
            return {};
        }
    };

    extractVolumedB = (displayText) => {
        const pattern = /.*\((-[0-9]+\.[0-9]) dB\)/;
        const match = pattern.exec(displayText);
        return match[1];
    };

    findByName = (name) => (item) => item._attributes.Name === name;

    /**
     * GETs some specific MCWS endpoint.
     * @param username
     * @param password
     * @param target
     * @param params
     * @param converter
     * @returns {Promise<*>}
     */
    _getMCWS = async ({url: urlRoot, username, password, target, params = [], converter}) => {
        const url = this.getUrl(urlRoot, target, params);
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getAuthHeader(username, password)
        });
        if (!response.ok) {
            throw new Error(`JRiverService.${target} failed, HTTP status ${response.status}`);
        }
        const data = await response.text();
        const json = xml2js(data, COMPACT);
        return converter(json);
    };
}

export default new JRiverService();
