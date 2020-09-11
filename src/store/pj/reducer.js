import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {makeError} from "../store";

export const initialState = Immutable({channel: ''});

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.SEND_COMMAND:
            return Immutable.without(state, 'keyError');
        case types.SEND_COMMAND_FAIL:
            return Immutable.set(state, {keyError: makeError(action)});
        case types.GET_DATA:
            return Immutable.set(Immutable.without(state, 'getError'), {[action.payload.cmd]: action.payload.response});
        case types.GET_DATA_FAIL:
            return Immutable.set(state, {getError: makeError(action)});
        default:
            return state;
    }
};

// selector functions
const errors = state => {
    return {
        key: state.keyError,
        get: state.getError
    };
};

const anamorphicMode = state => state.pj.Anamorphic;
const powerState = state => state.pj.PowerState;

export const getErrors = errors;
export const getAnamorphicMode = anamorphicMode;
export const getPowerState = powerState;

export default reduce;