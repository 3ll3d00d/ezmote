import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {createSelector} from "reselect";
import {getJRiverURL} from "../config/reducer";

export const initialState = Immutable({zones: Immutable({})});

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.FETCH_ZONES:
            const incomingKeys = Object.keys(action.payload);
            if (incomingKeys.length === 0) {
                return Immutable.setIn(state, {zones: Immutable({})});
            } else {
                const removedOld = Immutable.update(state, 'zones', z => Immutable.without(z, (value, key) => incomingKeys.indexOf(key) === -1));
                return Immutable.merge(removedOld, {zones: action.payload}, {deep: true});
            }
        case types.FETCH_ZONE_INFO:
            return Immutable.merge(state, {zones: {[action.payload.id]: action.payload}}, {deep: true});
        case types.SET_VOLUME:
            return Immutable.setIn(state, ['zones', action.payload.zoneId, 'volumeRatio'], action.payload.volumeRatio);
        case types.MUTE_VOLUME:
            return Immutable.setIn(state, ['zones', action.payload.zoneId, 'muted'], action.payload.muted);
        case types.UNMUTE_VOLUME:
            return Immutable.setIn(state, ['zones', action.payload.zoneId, 'muted'], action.payload.muted);
        case types.IS_ALIVE:
            return Immutable.merge(state, action.payload, {deep: true});
        case types.AUTHENTICATE:
            return Immutable.merge(state, action.payload, {deep: true});
        case types.FETCH_ZONES_FAIL:
        case types.FETCH_ZONE_INFO_FAIL:
        case types.SET_VOLUME_FAIL:
        case types.MUTE_VOLUME_FAIL:
        case types.UNMUTE_VOLUME_FAIL:
        case types.IS_ALIVE_FAIL:
        case types.AUTHENTICATE_FAIL:
            console.error(action.payload);
            return state;
        default:
            return state;
    }
};

// selector functions
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
    const {playingNow} = zone;
    if (playingNow.imageURL) {
        return Immutable.set(playingNow, 'imageURL', `${rootURL}/${playingNow.imageURL}`);
    }
    return playingNow;
};
// selectors
export const getAllZones = zones;
export const getActiveZone = createSelector([zones], activeZone);
export const getServerName = serverName;
export const getAuthToken = authToken;
export const getPlayingNow = createSelector([getActiveZone, getJRiverURL], playingNow);

export default reduce;