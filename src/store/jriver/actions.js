import keyBy from 'lodash.keyby';
import * as types from "./actionTypes";
import jriver from '../../services/jriver';
import poller from '../../services/timer';
import {getConfig, InvalidConfigError} from "../config/reducer";
import {getActiveZone, getAuthToken} from "./reducer";
import * as mcws from '../../services/jriver/mcws';
import {PLAY_TYPE_BROWSE, PLAY_TYPE_FILE} from '../../services/jriver/mcws/browseChildren';
import {STOPPED} from "../../services/jriver/mcws/playbackInfo";
import {fetchPlayingNow} from "../playingnow/actions";

/**
 * Sends the given key press(es).
 * @param keys the keys to press.
 * @returns {*}
 */
const sendKeyPresses = (keys) => {
    const keyPressArray = Array.isArray(keys) ? keys : [keys];
    return _invoke(types.SEND_KEYPRESS, types.SEND_KEYPRESS_FAIL, (config) => mcws.controlKey(config, keyPressArray));
};

/**
 * Starts playback for files at the specified browse node (if type is browse) or the file (if type is file).
 * @param type the play type (browse or file)
 * @param id the play key id.
 * @returns {*}
 */
const startPlayback = (type, id) => {
    if (type === PLAY_TYPE_BROWSE) {
        return _invoke(types.START_PLAYBACK, types.START_PLAYBACK_FAIL, (config) => mcws.playBrowse(config, id));
    } else if (type === PLAY_TYPE_FILE) {
        return _invoke(types.START_PLAYBACK, types.START_PLAYBACK_FAIL, (config) => mcws.fileGetInfo(config, id));
    } else {
        throw new Error(`Unknown playback type ${type} for id ${id}`);
    }
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
 * sends stop for all zones.
 */
const stopAllPlaying = () => {
    return _invoke(types.STOP_ALL, types.STOP_ALL_FAIL, (config) => mcws.playbackStopAll(config));
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
 * sets the active zone.
 */
const activateZone = (zoneId) => {
    return _invoke(types.SET_ZONE, types.SET_ZONE_FAIL, (config) => mcws.playbackSetZone(config, zoneId));
};

const _handleServerIsAlive = (successAction, response, state, dispatch) => {
    _dispatchResponseDirectly(successAction, response, state, dispatch);
    _stopPollerIfNecessary('jriverIsDead');
    if (_startPollerIfNecessary('jriverIsAlive', () => dispatch(isAlive()), 10000)) {
        dispatch(authenticate());
    }
    _startPollerIfNecessary('jriverFetchZones', () => dispatch(fetchZones()), 2000);
};

const _handleServerIsDead = (dispatch, config, type, error) => {
    _dispatchError(dispatch, config, type, error);
    _stopPollerIfNecessary('jriverIsAlive');
    _stopPollerIfNecessary('jriverFetchZones');
    poller.stopAllMatching('jriverZoneInfo_');
    _startPollerIfNecessary('jriverIsDead', () => dispatch(isAlive()), 2000);
};

/**
 * tests if the server is alive.
 * @returns {*}
 */
const isAlive = () => {
    return _invoke(types.IS_ALIVE, types.IS_ALIVE_FAIL, (config) => mcws.alive(config), _handleServerIsAlive, _handleServerIsDead);
};

const _startPollerIfNecessary = (eventId, action, delay) => {
    if (!poller.isPolling(eventId)) {
        console.info(`Starting ${eventId} poller`);
        poller.startPolling(eventId, action, delay);
        return true;
    }
    return false;
};
const _stopPollerIfNecessary = (eventId) => {
    if (poller.isPolling(eventId)) {
        console.info(`Stopping ${eventId} poller`);
        poller.stopPolling(eventId);
        return true;
    }
    return false;
};

/**
 * Stops all pollers.
 */
const stopAllPollers = () => poller.stopAll();

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

/*
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
        const zonesById = keyBy(response, 'id');
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
        } else if (!poller.isPolling(`jriverZoneInfo_${newActiveZone.id}`)) {
            console.info(`Poller for zone ${newActiveZone.id}/${newActiveZone.name} should be running but isn't, starting`);
            _doStart(newActiveZone, dispatch);
        }
    }
};

const _dispatchError = (dispatch, config, type, error) => dispatch({type: type, error: true, payload: error});

const _doStop = (existingActiveZone) => {
    if (!_stopPollerIfNecessary(`jriverZoneInfo_${existingActiveZone.id}`)) {
        console.error(`Unable to stop zoneInfo poller for ${existingActiveZone.id}/${existingActiveZone.name}`)
    }
};

const _doStart = (newActiveZone, dispatch) => {
    _startPollerIfNecessary(`jriverZoneInfo_${newActiveZone.id}`, () => dispatch(fetchZoneInfo(newActiveZone.id)), 2000);
};

/**
 * a thunk which asynchronously fetches detailed information about a single zone.
 * @returns {function(*, *)}
 */
const fetchZoneInfo = (zoneId) => {
    return _invoke(types.FETCH_ZONE_INFO, types.FETCH_ZONE_INFO_FAIL, (config) => mcws.playbackInfo(config, zoneId), (successAction, response, state, dispatch) => {
        _fetchZonesIfPlaybackStopped(response, state, dispatch);
        dispatch({type: successAction, payload: response});
        dispatch(fetchPlayingNow());
    });
};

const _fetchZonesIfPlaybackStopped = (response, state, dispatch) => {
    if (response.status === STOPPED) {
        const existingActiveZone = getActiveZone(state);
        if (existingActiveZone && existingActiveZone.status !== response.status) {
            dispatch(fetchZones())
        }
    }
};

const _dispatchResponseDirectly = (successAction, response, state, dispatch) => {
    dispatch(Object.assign({type: successAction}, {payload: response}));
};

const _invoke = (successAction, failureAction, getPayload, dispatcher = _dispatchResponseDirectly, errorDispatcher = _dispatchError) => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getConfig(state);
        const token = getAuthToken(state);
        if (config.valid === true) {
            const payload = getPayload(config);
            try {
                dispatcher(successAction, await jriver.invoke({token, ...payload}), state, dispatch)
            } catch (error) {
                errorDispatcher(dispatch, config, failureAction, error);
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
    stopAllPollers,
    playPause,
    stopPlaying,
    stopAllPlaying,
    playNext,
    playPrevious,
    sendKeyPresses,
    setPosition,
    startPlayback,
    activateZone
};