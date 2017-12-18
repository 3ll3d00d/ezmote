import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
    zones: Immutable([])
});

const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.ZONES_FETCHED:
            // TODO merge with the zone info data
            return state.merge({
                zones: action.payload.zones
            });
        case types.ZONE_INFO_FETCHED:
            // TODO merge zoneInfo into the zone data?
            return state;
        default:
            return state;
    }
};

export default reduce;