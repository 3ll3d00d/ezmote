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
        case types.SEND_TIVO_KEY:
            return Immutable.without(Immutable.set(state, 'channel', action.payload.channel), 'keyError');
        case types.SEND_TIVO_KEY_FAIL:
            return Immutable.set(state, 'keyError', makeError(action));
        case types.GET_TIVO_INFO:
            return Immutable.set(state, 'channel', action.payload.channel);
        case types.GET_TIVO_INFO_FAIL:
            return Immutable.set(state, 'getError', makeError(action));
        default:
            return state;
    }
};

// selector functions
const errors = state => {
    return {
        key: state.tivos.keyError
    };
};
const currentChannel = state => {
    if (state.tivos.channel) {
        if (state.tivos.channel.startsWith('Ch_Status')) {
            try {
                // Ch_Status 0108 Local
                return Number(state.tivos.channel.split(' ')[1]);
            } catch (e) {
                console.exception(`Unknown channel ${state.tivos.channel} - ${e.message}`);
            }
        }
    }
    return null;
};
export const getErrors = errors;
export const getCurrentChannel = currentChannel;

export default reduce;