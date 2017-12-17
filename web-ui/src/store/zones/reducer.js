import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
    zones: Immutable([])
});

const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.ZONES_FETCHED:
            return state.merge({
                zones: action.zones
            });
        default:
            return state;
    }
};

export default reduce;