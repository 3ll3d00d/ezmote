import _ from 'lodash';
import * as types from "./actionTypes";
import jriver from '../../services/jriver';
import poller from '../../services/timer';
import {getValidConfig} from "../config/reducer";
import {getActiveZone} from "./reducer";

/**
 * Sets the volume for the specified zone.
 * @param zoneId the zone.
 * @param volume the volume.
 */
const setVolume = (zoneId, volume) => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getValidConfig(state);
        if (config.valid) {
            try {
                const response = await jriver.setVolume(config.host, config.port, config.usessl, config.user, config.pass, zoneId, volume);
                dispatch(Object.assign({type: types.SET_VOLUME}, response));
            } catch (error) {
                dispatchError(dispatch, types.SET_VOLUME, error);
            }
        } else {
            dispatch({type: types.SET_VOLUME, error: 'Invalid MC Config'})
        }
    };
};

const dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: `${error.name} - ${error.message}`});
};

/**
 * a thunk which asynchronously fetches the zones.
 * @returns {function(*, *)}
 */
const fetchZones = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getValidConfig(state);
        if (config.valid) {
            try {
                const zones = await jriver.getZones(config.host, config.port, config.usessl, config.user, config.pass);
                const zonesById = _.keyBy(zones, 'id');
                ensureZoneInfoPollerIsRunning(zones, state, dispatch);
                dispatch({type: types.ZONES_FETCHED, payload: zonesById});
            } catch (error) {
                dispatchError(dispatch, types.ZONES_FETCHED, error);
            }
        }
    };
};

/**
 * Ensures that we have a poller for the active zone.
 * @param zones the new zone data.
 * @param state the current state (before dispatch)
 * @param dispatch redux function.
 */
const ensureZoneInfoPollerIsRunning = (zones, state, dispatch) => {
    const existingActiveZone = getActiveZone(state);
    const newActiveZone = getActiveZone({zones});
    if (newActiveZone && !existingActiveZone) {
        doStart(newActiveZone, dispatch);
    } else if (existingActiveZone && !newActiveZone) {
        doStop(existingActiveZone);
    } else if (existingActiveZone.id !== newActiveZone.id) {
        doStop(existingActiveZone);
        doStart(newActiveZone, dispatch);
    } else {
        if (!poller.isPolling(matchById(newActiveZone))) {
            // TODO dispatch error action
            console.debug(`No interval for zone ${newActiveZone.id}/${newActiveZone.name}`);
            doStart(newActiveZone, dispatch);
        }
    }
};

const matchById = (targetZone) => z => z.id === targetZone.id;

const doStop = (existingActiveZone) => {
    if (poller.stopPolling(matchById(existingActiveZone))) {
        console.debug(`Cleared interval for zone ${existingActiveZone.id}/${existingActiveZone.name}`);
    } else {
        console.error(`Unable to clear interval for zone ${existingActiveZone.id}/${existingActiveZone.name}`)
    }
};

const doStart = (newActiveZone, dispatch) => {
    console.info(`Starting interval for zone ${newActiveZone.id}/${newActiveZone.name}`);
    poller.startPolling(newActiveZone.id, () => dispatch(fetchZoneInfo(newActiveZone.id)), 500);
};

/**
 * a thunk which asynchronously fetches detailed information about a single zone.
 * @returns {function(*, *)}
 */
const fetchZoneInfo = (zoneId) => {
    return async (dispatch, getState) => {
        const config = getValidConfig(getState());
        try {
            const zoneInfo = await jriver.getZoneInfo(config.host, config.port, config.usessl, config.user, config.pass, zoneId);
            dispatch({type: types.ZONE_INFO_FETCHED, payload: zoneInfo});
        } catch (error) {
            dispatchError(dispatch, types.ZONE_INFO_FETCHED, error);
        }
    };
};

export {fetchZones, fetchZoneInfo, setVolume};