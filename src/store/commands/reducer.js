import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {createSelector} from "reselect";
import {makeError} from "../store";

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
            const incomingKeys = Object.keys(action.payload);
            if (incomingKeys.length === 0) {
                return Immutable.setIn(state, Immutable({}));
            } else {
                const removedOld = Immutable.without(state, (value, key) => incomingKeys.indexOf(key) === -1);
                return Immutable.without(Immutable.merge(removedOld, action.payload, {deep: true}), 'fetchError');
            }
        case types.SEND_COMMAND:
            return Immutable.without(state, 'sendError');
        case types.COMMANDS_FETCHED_FAIL:
            return Immutable.set(state, {fetchError: makeError(action)});
        case types.SEND_COMMAND_FAIL:
            return Immutable.set(state, {sendError: makeError(action)});
        default:
            return state;
    }
};

// selector functions
const commands = state => state.commands;
const errors = state => {
    return {
        fetch: state.fetchError,
        send: state.sendError,
    };
};
export const getErrors = errors;
export const getCommands = commands;
const getCommandArray = createSelector([getCommands], (commands) => Object.keys(commands).map(c => commands[c]));
export const getOrderedCommands = createSelector([getCommandArray], (commands) => commands.sort((a, b) => a.idx - b.idx));

export default reduce;