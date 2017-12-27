import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {createSelector} from "reselect";

export const initialState = Immutable({});

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
                return Immutable({});
            } else {
                const removedOld = Immutable.without(state, (value, key) => incomingKeys.indexOf(key) === -1);
                return Immutable.merge(removedOld, action.payload, {deep: true});
            }
        case types.FETCH_ZONES_FAIL:
            return state;
        case types.FETCH_ZONE_INFO:
            return Immutable.merge(state, {[action.payload.id]: action.payload}, {deep: true});
        case types.FETCH_ZONE_INFO_FAIL:
            return state;
        case types.SET_VOLUME:
            return Immutable.setIn(state, [action.payload.zoneId, 'volumeRatio'], action.payload.volumeRatio);
        case types.SET_VOLUME_FAIL:
            return state;
        case types.MUTE_VOLUME:
            return Immutable.setIn(state, [action.payload.zoneId, 'muted'], action.payload.muted);
        case types.MUTE_VOLUME_FAIL:
            return state;
        case types.UNMUTE_VOLUME:
            return Immutable.setIn(state, [action.payload.zoneId, 'muted'], action.payload.muted);
        case types.UNMUTE_VOLUME_FAIL:
            return state;
        case types.IS_ALIVE:
            return state;
        case types.IS_ALIVE_FAIL:
            return state;
        default:
            return state;
    }
};

// selector functions
const zones = state => state.zones;
const activeZone = zones => {
    const activeKey = Object.keys(zones).find(k => zones[k].active === true);
    if (activeKey) {
        return zones[activeKey];
    }
    return null;
};
// selectors
export const getAllZones = zones;
export const getActiveZone = createSelector(zones, activeZone);

export default reduce;