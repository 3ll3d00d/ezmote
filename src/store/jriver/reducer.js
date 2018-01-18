import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {createSelector} from "reselect";
import {getJRiverURL} from "../config/reducer";
import {makeKeyedError} from "../store";

export const initialState = Immutable({zones: Immutable({}), errors: Immutable({})});

const flipPlayingState = (status) => status === 'Playing' ? 'Paused' : 'Playing';

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        // info
        case types.FETCH_ZONES:
            const incomingKeys = Object.keys(action.payload);
            if (incomingKeys.length === 0) {
                state = Immutable.setIn(state, {zones: Immutable({})});
            } else {
                const removedOld = Immutable.update(state, 'zones', z => Immutable.without(z, (value, key) => incomingKeys.indexOf(key) === -1));
                state = Immutable.merge(removedOld, {zones: action.payload}, {deep: true});
            }
            break;
        case types.FETCH_ZONE_INFO:
            // this is basically just removing artist/album if it's not present on the inbound payload
            const zoneInfoProperties = Object.keys(action.payload);
            let toMerge = state;
            if (zoneInfoProperties.length > 0) {
                toMerge = Immutable.updateIn(state, ['zones', action.payload.id], z => Immutable.without(z, (value, key) => zoneInfoProperties.indexOf(key) === -1));
            }
            state = Immutable.merge(toMerge, {zones: {[action.payload.id]: action.payload}}, {deep: true});
            break;
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
        // health
        case types.IS_ALIVE:
            state = Immutable.set(Immutable.merge(state, action.payload, {deep: true}), 'errors', Immutable({}));
            break;
        case types.AUTHENTICATE:
            state = Immutable.merge(state, action.payload, {deep: true});
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
            break;
        // errors
        case types.IS_ALIVE_FAIL:
            // remove playing now so we don't show anything as actually playing but leave other information in place
            state = storeError(action, stripToken(Immutable.set(state, 'zones', stripPlayingNow(state))));
            break;
        case types.FETCH_ZONES_FAIL:
        case types.FETCH_ZONE_INFO_FAIL:
        case types.SET_VOLUME_FAIL:
        case types.MUTE_VOLUME_FAIL:
        case types.UNMUTE_VOLUME_FAIL:
        case types.AUTHENTICATE_FAIL:
        case types.PLAY_PAUSE_FAIL:
        case types.STOP_FAIL:
        case types.STOP_ALL_FAIL:
        case types.NEXT_FAIL:
        case types.PREVIOUS_FAIL:
        case types.SET_POSITION_FAIL:
        case types.START_PLAYBACK_FAIL:
        case types.SET_ZONE_FAIL:
            state = storeError(action, state);
            break;
        default:
            break;
    }
    return discardOldErrors(state);
};

const stripToken = state => Immutable.without(state, 'token');
const stripPlayingNow = ({zones}) => Object.keys(zones).map(z => Immutable.without(zones[z], 'playingNow'));
const storeError = (action, state) => Immutable.merge(state, {errors: makeKeyedError(action)}, {deep: true});
const isOldError = (time) => (value, key) => (time - key) > 15000;
const discardOldErrors = (state) => Immutable.update(state, 'errors', e => Immutable.without(e, isOldError(new Date().getTime())));

// selector functions
const errors = state => state.jriver.errors;
const zones = state => state.jriver.zones;
const authToken = state => state.jriver.token;
const serverName = state => state.jriver.serverName;
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
const findIsAliveError = errors => Object.keys(errors).map(e => errors[e].type).some(t => t === types.IS_ALIVE_FAIL);

// selectors
export const getErrors = errors;
export const isJRiverDead = createSelector([errors], findIsAliveError);
export const getAllZones = zones;
export const getActiveZone = createSelector([zones], activeZone);
export const getServerName = serverName;
export const getAuthToken = authToken;
export const getPlayingNow = createSelector([getActiveZone, getJRiverURL], playingNow);

export default reduce;