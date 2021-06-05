import * as types from "./actionTypes";
import {GET_INFO, GET_INFO_FAIL} from "./actionTypes";
import jriver from '../../services/jriver';
import {getConfig} from "../config/reducer";
import {getAuthToken, getJRiverURL} from "./reducer";
import * as mcws from '../../services/jriver/mcws';
import {PLAY_TYPE_BROWSE, PLAY_TYPE_FILE} from '../../services/jriver/mcws/browseChildren';

/**
 * Sends the given key press(es).
 * @param keys the keys to press.
 * @returns {*}
 */
const sendKeyPresses = (keys) => {
    const keyPressArray = Array.isArray(keys) ? keys : [keys];
    return _invoke(types.SEND_KEYPRESS, types.SEND_KEYPRESS_FAIL, (serverURL) => mcws.controlKey(serverURL, keyPressArray));
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

const _dispatchError = (dispatch, config, type, error) => dispatch({type: type, error: true, payload: error});

const _dispatchResponseDirectly = (successAction, response, state, dispatch) => {
    dispatch(Object.assign({type: successAction}, {payload: response}));
};

const _invoke = (successAction, failureAction, getPayload, dispatcher = _dispatchResponseDirectly, errorDispatcher = _dispatchError) => {
    return async (dispatch, getState) => {
        const state = getState();
        const serverURL = getJRiverURL(state);
        const token = getAuthToken(state);
        const payload = getPayload(serverURL);
        try {
            dispatcher(successAction, await jriver.invoke({serverURL, token, ...payload}), state, dispatch)
        } catch (error) {
            errorDispatcher(dispatch, config, failureAction, error);
        }
    };
};

const connectWsToStore = store => {
    const wsHost = "ws://" + window.location.host + "/ws";
    console.info(`Connecting ws to ${wsHost}`);
    const webSocket = new WebSocket(wsHost);
    webSocket.onmessage = e => {
        store.dispatch({type: GET_INFO, payload: JSON.parse(e.data)});
    }
    webSocket.onerror = e => {
        store.dispatch({type: GET_INFO_FAIL, payload: 'error'});
    };
}

export {
    connectWsToStore,
    setVolume,
    muteVolume,
    unmuteVolume,
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