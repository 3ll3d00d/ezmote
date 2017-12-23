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
        case types.ZONES_FETCHED:
            if (action.hasOwnProperty('payload')) {
                return Immutable.merge(state, action.payload, {deep: true});
            } else if (action.hasOwnProperty('error')) {
                // TODO handle
                return state;
            } else {
                return state;
            }
        case types.ZONE_INFO_FETCHED:
            if (action.hasOwnProperty('payload')) {
                return Immutable.merge(state, {[action.payload.id]: action.payload}, {deep: true});
            } else if (action.hasOwnProperty('error')) {
                // TODO handle
                return state;
            } else {
                return state;
            }
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
export const getAllZones = createSelector(zones);
export const getActiveZone = createSelector(zones, activeZone);

export default reduce;