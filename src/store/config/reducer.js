import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import * as fields from './config';
import {createSelector} from 'reselect';

export const initialState = Immutable({
    [fields.TIVO_NAME]: 'C6800002157CBFB'
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
            return Immutable.merge(state, {[action.payload.field]: action.payload.value});
        default:
            return state;
    }
};

// selector functions
export const getConfig = state => state.config;
export const getTivoName = createSelector([getConfig], config => config[fields.TIVO_NAME]);

export default reduce;
