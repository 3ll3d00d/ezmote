import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import * as fields from './config';

export const initialState = Immutable({
    [fields.MC_USE_SSL]: false,
    [fields.MC_HOST]: 'localhost',
    [fields.MC_PORT]: 52199,
    [fields.MC_USERNAME]: '',
    [fields.MC_PASSWORD]: ''
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
            return validatedConfig(Immutable.merge(state, {[action.payload.field]: action.payload.value}));
        default:
            return validatedConfig(state);
    }
};

const isValidValue = (config, key) => {
    return config.hasOwnProperty(key) && config[key];
};

const collectInvalid = (config, invalids, field) => {
    if (!isValidValue(config, field)) invalids.push(field);
};

const validatedConfig = config => {
    if (config) {
        const invalids = [];
        collectInvalid(config, invalids, fields.MC_HOST);
        collectInvalid(config, invalids, fields.MC_PORT);
        collectInvalid(config, invalids, fields.MC_USERNAME);
        collectInvalid(config, invalids, fields.MC_PASSWORD);
        if (invalids.length === 0) {
            return Immutable.without(Immutable.merge(config, {valid: true}), 'error');
        } else {
            return Immutable.merge(config, {valid: false, error: `Missing values: ${invalids.toString()}`});
        }
    } else {
        return Immutable({valid: false, error: 'No config'});
    }
};

// selector functions
const config = state => {
    return state.config;
};

// selectors
export const getConfig = config;

export default reduce;