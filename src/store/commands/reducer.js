import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {createSelector} from "reselect";

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
                return Immutable.merge(removedOld, action.payload, {deep: true});
            }
        case types.SENT_COMMAND:
            return state;
        case types.COMMANDS_FETCHED_FAIL:
        case types.SENT_COMMAND_FAIL:
            console.error(action.payload);
            return state;
        default:
            return state;
    }
};

// selector functions
const commands = state => state.commands;
export const getCommands = commands;
const getCommandArray = createSelector([getCommands], (commands) => Object.keys(commands).map(c => commands[c]));
export const getOrderedCommands = createSelector([getCommandArray], (commands) => commands.sort((a, b) => a.idx - b.idx));

export default reduce;