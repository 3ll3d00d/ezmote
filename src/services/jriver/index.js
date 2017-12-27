import {xml2js} from 'xml-js';
import base64 from 'base-64';
import * as fields from "../../store/config/config";

const COMPACT = {compact: true, ignoreDeclaration: true};

/**
 * A service that can invoke MCWS and returns the result in some js object payload.
 */
class JRiverService {

    /**
     * Calls MCWS.
     * @returns {Promise<*>}
     */
    invoke = async ({config, name, path, requiredParams, suppliedParams = {}, converter}) => {
        const url = this._getUrl(config, path, requiredParams, suppliedParams);
        const response = await fetch(url, {
            method: 'GET',
            headers: this._getAuthHeader(config[fields.MC_USERNAME], config[fields.MC_PASSWORD])
        });
        if (!response.ok) {
            throw new Error(`JRiverService.${name} failed, HTTP status ${response.status}`);
        }
        const data = await response.text();
        const json = xml2js(data, COMPACT);
        return converter(json);
    };

    _getParams = (params) => {
        const esc = encodeURIComponent;
        return Object.keys(params).map(k => esc(k) + '=' + esc(params[k])).join('&');
    };

    _validateParams = (suppliedParams, requiredParams) => {
        if (Object.keys(suppliedParams).length === requiredParams.length) {
            return Object.keys(suppliedParams).every(k => requiredParams.findIndex(p => k === p) > -1);
        }
        return false;
    };

    _getUrl = (config, path, requiredParams, suppliedParams) => {
        const root = `http${config[fields.MC_USE_SSL] ? 's' : ''}://${config[fields.MC_HOST]}:${config[fields.MC_PORT]}/${path}`;
        if (Object.keys(suppliedParams).length > 0) {
            if (this._validateParams(suppliedParams, requiredParams)) {
                return `${root}?${this._getParams(suppliedParams)}`;
            } else {
                // TODO format error to show the bad params
                throw new Error(`Invalid params for target ${path} - ${suppliedParams}`)
            }
        } else {
            return root;
        }
    };

    _getAuthHeader = (username, password) => {
        return {
            Authorization: 'Basic ' + base64.encode(username + ":" + password)
        };
    };
}

export default new JRiverService();
