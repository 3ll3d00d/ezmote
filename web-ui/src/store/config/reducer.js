import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {createSelector} from "reselect";

// config values
export const MC_USE_SSL = 'mcssl';
export const MC_HOST = 'mchost';
export const MC_PORT = 'mcport';
export const MC_USERNAME = 'mcusername';
export const MC_PASSWORD = 'mcpassword';

export const initialState = Immutable({
    [MC_USE_SSL]: false,
    [MC_HOST]: 'localhost',
    [MC_PORT]: 52199,
    [MC_USERNAME]: '',
    [MC_PASSWORD]: ''
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
const config = state => {
    return state.config;
};
const isValidValue = (config, key) => {
    return config.hasOwnProperty(key) && config[key];
};
const validConfig = config => {
    if (config
        && isValidValue(config, MC_HOST)
        && isValidValue(config, MC_PORT)
        && isValidValue(config, MC_USERNAME)
        && isValidValue(config, MC_PASSWORD)) {
        return Object.assign(config, {valid: true});
    } else {
        // TODO add error
        return {valid: false};
    }
};

// selectors
export const getConfigValues = config;
export const getValidConfig = createSelector(config, validConfig);

export default reduce;