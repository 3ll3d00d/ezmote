import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {createSelector} from "reselect";
import {makeKeyedError} from "../errors";

export const initialState = Immutable({
    config: Immutable({}),
    playingCommand: Immutable({}),
    zones: Immutable({}),
    errors: Immutable({})
});

const flipPlayingState = (status) => status === 'Playing' ? 'Paused' : 'Playing';

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        // volume
        case types.SET_VOLUME:
            state = Immutable.setIn(state, ['zones', action.payload.zoneId, 'volumeRatio'], action.payload.volumeRatio);
            break;
        case types.MUTE_VOLUME:
            state = Immutable.setIn(state, ['zones', action.payload.zoneId, 'muted'], action.payload.muted);
            break;
        case types.UNMUTE_VOLUME:
            state = Immutable.setIn(state, ['zones', action.payload.zoneId, 'muted'], action.payload.muted);
            break;
        // playback
        case types.PLAY_PAUSE:
            state = Immutable.updateIn(state, ['zones', action.payload.zoneId, 'playingNow', 'status'], flipPlayingState);
            break;
        case types.STOP:
            state = Immutable.setIn(state, ['zones', action.payload.zoneId, 'playingNow', 'status'], 'Stopped');
            break;
        case types.STOP_ALL:
            break;
        case types.NEXT:
            break;
        case types.PREVIOUS:
            break;
        case types.SET_POSITION:
            state = Immutable.setIn(state, ['zones', 'playingNow', 'positionMillis'], action.payload);
            break;
        case types.START_PLAYBACK:
            break;
        case types.SET_ZONE:
            Object.keys(state.zones).forEach(z => {
                state = Immutable.setIn(state, ['zones', z, 'active'], z.toString() === action.payload.zoneId.toString());
            });
            break;
        case types.GET_INFO:
            return Immutable.merge(state, {...action.payload}, {deep: true});
        // errors
        case types.GET_INFO_FAIL:
        case types.SET_VOLUME_FAIL:
        case types.MUTE_VOLUME_FAIL:
        case types.UNMUTE_VOLUME_FAIL:
        case types.PLAY_PAUSE_FAIL:
        case types.STOP_FAIL:
        case types.STOP_ALL_FAIL:
        case types.NEXT_FAIL:
        case types.PREVIOUS_FAIL:
        case types.SET_POSITION_FAIL:
        case types.START_PLAYBACK_FAIL:
        case types.SET_ZONE_FAIL:
            state = storeError(action, state);
            console.error(action.payload);
            break;
        default:
            break;
    }
    return discardOldErrors(state);
};

const storeError = (action, state) => Immutable.merge(state, {errors: makeKeyedError(action)}, {deep: true});
const isOldError = (time) => (value, key) => (time - key) > 15000;
const discardOldErrors = (state) => Immutable.update(state, 'errors', e => Immutable.without(e, isOldError(new Date().getTime())));

// selector functions
const errors = state => state.jriver.errors;
const zones = state => state.jriver.zones;
const authToken = state => state.jriver.config.token;
const activeZone = zones => {
    if (zones) {
        const activeKey = Object.keys(zones).find(k => zones[k].active === true);
        if (activeKey) {
            return zones[activeKey];
        }
    }
    return null;
};
const playingNow = (zone, rootURL) => {
    if (zone) {
        const {playingNow} = zone;
        if (playingNow && playingNow.imageURL) {
            return Immutable.set(playingNow, 'imageURL', `${rootURL}/${playingNow.imageURL}`);
        }
        return playingNow;
    }
    return null;
};

// selectors
export const getJRiverURL = state => `http${state.jriver.config.ssl ? 's' : ''}://${state.jriver.config.host}:${state.jriver.config.port}`;
export const getAllZones = zones;
export const isJRiverDead = state => state.jriver.config.alive !== true;
export const getActiveZone = createSelector([zones], activeZone);
export const getActiveCommand = state => state.jriver.playingCommand.active;
export const getPlayingNow = createSelector([getActiveZone, getJRiverURL], playingNow);
export const getAuthToken = authToken;
export const getErrors = errors;

export default reduce;