import {xml2js} from 'xml-js';

const COMPACT = {compact: true, ignoreDeclaration: true};

/**
 * A service that can invoke MCWS and returns the result in some js object payload.
 */
class JRiverService {

    /**
     * Calls MCWS.
     * @returns {Promise<*>}
     */
    invoke = async ({serverURL, name, path, requiredParams, suppliedParams = {}, converter, token = undefined}) => {
        const url = this._getUrl(serverURL, token, path, requiredParams, suppliedParams);
        const response = await fetch(url, {
            method: 'GET',
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

    _getUrl = (serverURL, token, path, requiredParams, suppliedParams) => {
        const root = `${serverURL}/${path}`;
        if (Object.keys(suppliedParams).length > 0) {
            if (this._validateParams(suppliedParams, requiredParams)) {
                return this._withToken(token, `${root}?${this._getParams(suppliedParams)}`, true);
            } else {
                // TODO format error to show the bad params
                throw new Error(`Invalid params for target ${path} - ${suppliedParams}`)
            }
        } else {
            return this._withToken(token, root, false);
        }
    };

    _withToken = (token, url, hasParams) => {
        if (token) {
            return `${url}${hasParams ? '&' : '?'}Token=${token}`;
        }
        return url;
    };
}

export default new JRiverService();
