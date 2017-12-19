import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

// TOOD wrap in an mcws object?
export const initialState = Immutable({
    url: 'https://localhost:52199',
    user: '',
    pass: ''
});

/**
 * Handles config state updates.
 * @param state
 * @param action
 * @returns {*}
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.CONFIG_VALUE_UPDATE:
            return Immutable.merge(state, { [action.payload.field]: action.payload.value });
        default:
            return state;
    }
};

/**
 * Select current config from state;
 * @param state
 * @returns {{user: *, pass: *, url: *}}
 */
export const getConfigValues = (state) => {
    const {user, pass, url} = state;
    return {user, pass, url};
};

export default reduce;