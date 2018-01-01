import _ from 'lodash';
import * as types from "./actionTypes";
import jriver from '../../services/jriver';
import poller from '../../services/timer';
import {getConfig, InvalidConfigError} from "../config/reducer";
import {getActiveZone, getAuthToken} from "./reducer";
import * as mcws from '../../services/jriver/mcws';

/**
 * Starts playback for files at the specified node.
 * @param nodeId
 * @returns {*}
 */
const startPlayback = (nodeId) => {
    return _invoke(types.START_PLAYBACK, types.START_PLAYBACK_FAIL, (config) => mcws.browseFiles(config, nodeId));
};

/**
 * Sets the position for the currently playing file.
 * @param zoneId the zone id.
 * @param position the position in millis.
 * @returns {*}
 */
const setPosition = (zoneId, position) => {
    return _invoke(types.SET_POSITION, types.SET_POSITION_FAIL, (config) => mcws.playbackPosition(config, zoneId, position));
};

/**
 * sends play/pause for the currently active zone.
 */
const playPause = (zoneId) => {
    return _invoke(types.PLAY_PAUSE, types.PLAY_PAUSE_FAIL, (config) => mcws.playbackPlayPause(config, zoneId));
};

/**
 * sends stop for the currently active zone.
 */
const stopPlaying = (zoneId) => {
    return _invoke(types.STOP, types.STOP_FAIL, (config) => mcws.playbackStop(config, zoneId));
};

/**
 * sends next for the currently active zone.
 */
const playNext = (zoneId) => {
    return _invoke(types.NEXT, types.NEXT_FAIL, (config) => mcws.playbackNext(config, zoneId));
};

/**
 * sends previous for the currently active zone.
 */
const playPrevious = (zoneId) => {
    return _invoke(types.PREVIOUS, types.PREVIOUS_FAIL, (config) => mcws.playbackPrevious(config, zoneId));
};

/**
 * tests if the server is alive.
 * @returns {*}
 */
const isAlive = () => {
    return _invoke(types.IS_ALIVE, types.IS_ALIVE_FAIL, (config) => mcws.alive(config), (successAction, response, state, dispatch) => {
        _dispatchResponseDirectly(successAction, response, state, dispatch);
        if (_startServerPollerIfNecessary(response.serverName, dispatch)) {
            dispatch(authenticate());
        }
    });
};

/**
 * Polls for ALIVE.
 * @param serverName the server name.
 * @param dispatch the redux dispatcher.
 */
const _startServerPollerIfNecessary = (serverName, dispatch) => {
    if (!poller.isPolling(p => p.id === serverName)) {
        console.info(`Start polling for ${serverName}`);
        poller.startPolling(serverName, () => dispatch(isAlive()), 10000);
        return true;
    }
    return false;
};

/**
 * Stops polling for ALIVE.
 * @param serverName
 */
const stopServerPoller = (serverName) => {
    poller.stopPolling(p => p.id === serverName);
};

/**
 * Gets the auth token from the server.
 * @returns {*}
 */
const authenticate = () => {
    return _invoke(types.AUTHENTICATE, types.AUTHENTICATE_FAIL, (config) => mcws.authenticate(config));
};

/**
 * mutes the volume in the specified zone.
 * @param zoneId the zoneId.
 */
const muteVolume = (zoneId) => {
    return _invoke(types.MUTE_VOLUME, types.MUTE_VOLUME_FAIL, (config) => mcws.playbackMute(config, zoneId, true), _dispatchMute(zoneId));
};

/**
 * unmutes the volume in the specified zone.
 * @param zoneId the zoneId.
 */
const unmuteVolume = (zoneId) => {
    return _invoke(types.UNMUTE_VOLUME, types.UNMUTE_VOLUME_FAIL, (config) => mcws.playbackMute(config, zoneId, false), _dispatchMute(zoneId));
};

const _dispatchMute = (zoneId) => (successAction, response, state, dispatch) => {
    dispatch({type: successAction, payload: {muted: response, zoneId}});
};

/**
 * Sets the volume for the specified zone.
 * @param zoneId the zone.
 * @param volume the volume.
 */
const setVolume = (zoneId, volume) => {
    return _invoke(types.SET_VOLUME, types.SET_VOLUME_FAIL, (config) => mcws.playbackVolume(config, zoneId, volume), (successAction, response, state, dispatch) => {
        dispatch({type: successAction, payload: {volumeRatio: response, zoneId}});
    });
};

/**
 * a thunk which asynchronously fetches the zones.
 * @returns {function(*, *)}
 */
const fetchZones = () => {
    return _invoke(types.FETCH_ZONES, types.FETCH_ZONES_FAIL, (config) => mcws.playbackZones(config), (successAction, response, state, dispatch) => {
        const zonesById = _.keyBy(response, 'id');
        _ensureZoneInfoPollerIsRunning(response, state, dispatch);
        dispatch({type: successAction, payload: zonesById});
    });
};

/**
 * Ensures that we have the right poller running.
 * @param zones the new zone data.
 * @param state the current state (before dispatch)
 * @param dispatch redux function.
 */
const _ensureZoneInfoPollerIsRunning = (zones, state, dispatch) => {
    const existingActiveZone = getActiveZone(state);
    const newActiveZone = getActiveZone({jriver: {zones}});
    if (existingActiveZone) {
        if (!newActiveZone || existingActiveZone.id !== newActiveZone.id) {
            _doStop(existingActiveZone, dispatch);
        }
    }
    if (newActiveZone) {
        if (!existingActiveZone || existingActiveZone.id !== newActiveZone.id) {
            _doStart(newActiveZone, dispatch);
        } else if (!poller.isPolling(_matchById(newActiveZone))) {
            console.info(`Poller for zone ${newActiveZone.id}/${newActiveZone.name} should be running but isn't, starting`);
            _doStart(newActiveZone, dispatch);
        }
    }
};

const _dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: true, payload: error});
};

const _matchById = (targetZone) => z => z.id === targetZone.id;

const _doStop = (existingActiveZone) => {
    if (poller.stopPolling(_matchById(existingActiveZone))) {
        console.info(`Cleared interval for zone ${existingActiveZone.id}/${existingActiveZone.name}`);
    } else {
        console.error(`Unable to clear interval for zone ${existingActiveZone.id}/${existingActiveZone.name}`)
    }
};

const _doStart = (newActiveZone, dispatch) => {
    console.info(`Starting interval for zone ${newActiveZone.id}/${newActiveZone.name}`);
    poller.startPolling(newActiveZone.id, () => dispatch(fetchZoneInfo(newActiveZone.id)), 5000);
};

/**
 * a thunk which asynchronously fetches detailed information about a single zone.
 * @returns {function(*, *)}
 */
const fetchZoneInfo = (zoneId) => {
    return _invoke(types.FETCH_ZONE_INFO, types.FETCH_ZONE_INFO_FAIL, (config) => mcws.playbackInfo(config, zoneId), (successAction, response, state, dispatch) => {
        dispatch({type: successAction, payload: response});
        if (response.status === 'Stopped') {
            // TODO only do this if the last known state was running
            dispatch(fetchZones())
        }
    });
};

const _dispatchResponseDirectly = (successAction, response, state, dispatch) => {
    dispatch(Object.assign({type: successAction}, {payload: response}));
};

const _invoke = (successAction, failureAction, getPayload, dispatcher = _dispatchResponseDirectly) => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getConfig(state);
        const token = getAuthToken(state);
        if (config.valid === true) {
            const payload = getPayload(config);
            try {
                dispatcher(successAction, await jriver.invoke({token, ...payload}), state, dispatch)
            } catch (error) {
                _dispatchError(dispatch, failureAction, error);
            }
        } else {
            dispatch({type: failureAction, error: true, payload: new InvalidConfigError(config)})
        }
    };
};

export {
    fetchZones,
    fetchZoneInfo,
    setVolume,
    muteVolume,
    unmuteVolume,
    isAlive,
    authenticate,
    stopServerPoller,
    playPause,
    stopPlaying,
    playNext,
    playPrevious,
    setPosition,
    startPlayback
};