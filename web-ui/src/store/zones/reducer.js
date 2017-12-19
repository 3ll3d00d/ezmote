import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

export const initialState = Immutable({
    zones: Immutable({})
});

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.ZONES_FETCHED:
            return Immutable.merge(state, { zones: action.payload }, {deep: true});
        case types.ZONE_INFO_FETCHED:
            return Immutable.merge(state, { zones: { [action.payload.id]: action.payload } }, {deep: true});
        default:
            return state;
    }
};

/**
 * Gets the zone data from state.
 * @param state the state.
 * @returns {*} the zones.
 */
export const getZoneData = (state) => {
    const {zones} = state;
    return zones;
};

export default reduce;