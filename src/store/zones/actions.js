import _ from 'lodash';
import * as types from "./actionTypes";
import jriver from '../../services/jriver';
import poller from '../../services/timer';
import {getConfig} from "../config/reducer";
import {getActiveZone} from "./reducer";
import * as mcws from '../../services/jriver/mcws';

/**
 * Sets the volume for the specified zone.
 * @param zoneId the zone.
 * @param volume the volume.
 */
const setVolume = (zoneId, volume) => {
    return async (dispatch, getState) => {
        const config = getConfig(getState());
        if (config.valid) {
            try {
                const response = await jriver.invoke(mcws.playbackVolume(config, zoneId, volume));
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
        const config = getConfig(state);
        if (config.valid) {
            try {
                const zones = await jriver.invoke(mcws.playbackZones(config));
                const zonesById = _.keyBy(zones, 'id');
                ensureZoneInfoPollerIsRunning(zones, state, dispatch);
                dispatch({type: types.ZONES_FETCHED, payload: zonesById});
            } catch (error) {
                dispatchError(dispatch, types.ZONES_FETCHED, error);
            }
        } else {
            dispatch({type: types.ZONES_FETCHED, error: 'Invalid MC Config'})
        }
    };
};

/**
 * Ensures that we have the right poller running.
 * @param zones the new zone data.
 * @param state the current state (before dispatch)
 * @param dispatch redux function.
 */
const ensureZoneInfoPollerIsRunning = (zones, state, dispatch) => {
    const existingActiveZone = getActiveZone(state);
    const newActiveZone = getActiveZone({zones});
    if (existingActiveZone) {
        if (!newActiveZone || existingActiveZone.id !== newActiveZone.id) {
            doStop(existingActiveZone, dispatch);
        }
    }
    if (newActiveZone) {
        if (!existingActiveZone || existingActiveZone.id !== newActiveZone.id) {
            doStart(newActiveZone, dispatch);
        } else if (!poller.isPolling(matchById(newActiveZone))) {
            console.debug(`Poller for zone ${newActiveZone.id}/${newActiveZone.name} should be running but isn't, starting`);
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
        const config = getConfig(getState());
        try {
            const zoneInfo = await jriver.invoke(mcws.playbackInfo(config, zoneId));
            dispatch({type: types.ZONE_INFO_FETCHED, payload: zoneInfo});
            if (zoneInfo.status === 'Stopped') {
                dispatch(fetchZones())
            }
        } catch (error) {
            dispatchError(dispatch, types.ZONE_INFO_FETCHED, error);
        }
    };
};

export {fetchZones, fetchZoneInfo, setVolume};