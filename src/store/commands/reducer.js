import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

export const initialState = Immutable({});

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.COMMANDS_FETCHED:
            if (action.hasOwnProperty('payload')) {
                return Immutable.merge(state, action.payload, {deep: true});
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
const commands = state => state.commands;
export const getCommands = commands;

export default reduce;