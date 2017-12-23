import {xml2js} from 'xml-js';
import base64 from 'base-64';
import * as fields from "../store/config/config";

const ENDPOINTS = {
    'GET_ZONES': {path: 'MCWS/v1/Playback/Zones', params: []},
    'GET_ZONE_INFO': {path: 'MCWS/v1/Playback/Info', params: ['Zone']},
    'SET_VOLUME': {path: 'MCWS/v1/Playback/Volume', params: ['Level', 'Zone']}
};

const COMPACT = {compact: true, ignoreDeclaration: true};

/**
 * Encapsulates any calls to MCWS.
 */
class JRiverService {

    /**
     * Sets the volume in the specified zone.
     * @returns {Promise<void>}
     */
    setVolume = async (config, zoneId, volume) => {
        return this._getMCWS({
            config,
            target: 'SET_VOLUME',
            params: {Zone: zoneId, Level: volume},
            converter: this.extractSetVolumeSuccess
        });
    };

    extractSetVolumeSuccess = (json) => {
        if (json.Response._attributes.Status === 'OK' && json.Response.hasOwnProperty('Item')) {
            const level = json.Response.Item.find(this.findByName('Level'));
            if (level) {
                return {payload: level}
            }
        }
        // TODO return error
        return {error: true}
    };

    /**
     * Gets basic information about all zones.
     * @returns {Promise<void>}
     */
    getZones = async (config) => {
        return this._getMCWS({config, target: 'GET_ZONES', converter: this.extractZones});
    };

    getParams = (params) => {
        const esc = encodeURIComponent;
        return Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    };

    validateParams = (suppliedParams, expectedParams) => {
        if (Object.keys(suppliedParams).length === expectedParams.length) {
            return Object.keys(suppliedParams).every(k => expectedParams.findIndex(p => k === p) > -1);
        }
        return false;
    };

    getUrl = (config, target, suppliedParams = {}) => {
        if (ENDPOINTS.hasOwnProperty(target)) {
            const endpoint = ENDPOINTS[target];
            const root = `http${config[fields.MC_USE_SSL]?'s':''}://${config[fields.MC_HOST]}:${config[fields.MC_PORT]}/${endpoint.path}`;
            if (Object.keys(suppliedParams).length > 0) {
                if (this.validateParams(suppliedParams, endpoint.params)) {
                    return `${root}?${this.getParams(suppliedParams)}`;
                } else {
                    // TODO format error to show the bad params
                    throw new Error(`Invalid params for target ${endpoint} - ${suppliedParams}`)
                }
            } else {
                return root;
            }
        }
        throw new Error(`Unknown target - ${target}`);
    };

    getAuthHeader = (username, password) => {
        return {
            Authorization: 'Basic ' + base64.encode(username + ":" + password)
        };
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
                        .map(z => Object.assign(z, {active: (activeZoneId && z.id === activeZoneId)}));
        } else {
            // TODO report error?
            return [];
        }
    };

    /**
     * Gets detailed information about a particular zone.
     * @returns {Promise<{volume, volumedb, fileKey, imageURL}>}
     */
    getZoneInfo = async (config, zoneId) => {
        return this._getMCWS({
            config,
            target: 'GET_ZONE_INFO',
            params: {Zone: zoneId},
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
                imageURL: json.Response.Item.find(this.findByName('ImageURL'))._text,
                status: json.Response.Item.find(this.findByName('Status'))._text
            }
        } else {
            // TODO send error type
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
     * @returns {Promise<*>}
     */
    _getMCWS = async ({config, target, params = {}, converter}) => {
        const url = this.getUrl(config, target, params);
        const response = await fetch(url, {
            method: 'GET',
            headers: this.getAuthHeader(config[fields.MC_USERNAME], config[fields.MC_PASSWORD])
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
