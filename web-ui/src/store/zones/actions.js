import _ from 'lodash';
import * as types from "./actionTypes";
import jriver from '../../services/jriver';
import {getConfigValues} from "../config/reducer";

/**
 * a thunk which asynchronously fetches the zones.
 * @returns {function(*, *)}
 */
const fetchZones = () => {
    return async (dispatch, getState) => {
        const config = getConfigValues(getState());
        try {
            const zones = await jriver.getZones(config.url, config.user, config.pass);
            const zonesById = _.keyBy(zones, 'id');
            dispatch({type: types.ZONES_FETCHED, payload: zonesById});
            // TODO now we have zones, we need to dispatch zone status calls periodically
        } catch (error) {
            console.error(error);
        }
    };
};

/**
 * a thunk which asynchronously fetches detailed information about a single zone.
 * @returns {function(*, *)}
 */
const fetchZoneInfo = (zoneId) => {
    return async (dispatch, getState) => {
        const config = getConfigValues(getState());
        try {
            const zoneInfo = await jriver.getZoneInfo(config.url, config.user, config.pass, zoneId);
            dispatch({type: types.ZONE_INFO_FETCHED, payload: zoneInfo});
        } catch (error) {
            console.error(error);
        }
    };
};

export {fetchZones, fetchZoneInfo};