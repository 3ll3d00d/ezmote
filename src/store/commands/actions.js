import _ from 'lodash';
import * as types from "./actionTypes";
import cmdserver from '../../services/cmdserver';
import {getConfig} from "../config/reducer";

const dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: `${error.name} - ${error.message}`});
};

/**
 * a thunk which asynchronously fetches the commands.
 * @returns {function(*, *)}
 */
const fetchCommands = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getConfig(state);
        if (config.valid) {
            try {
                const commands = await cmdserver.getCommands(config);
                const byId = _.keyBy(commands, 'id');
                dispatch({type: types.COMMANDS_FETCHED, payload: byId});
            } catch (error) {
                dispatchError(dispatch, types.COMMANDS_FETCHED, error);
            }
        } else {
            dispatch({type: types.COMMANDS_FETCHED, error: 'Invalid CMDServer Config'})
        }
    };
};

const sendCommand = (commandId) => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getConfig(state);
        if (config.valid) {
            try {
                const response = await cmdserver.sendCommand(config, commandId);
                dispatch({type: types.SENT_COMMAND, payload: response});
            } catch (error) {
                dispatchError(dispatch, types.SENT_COMMAND, error);
            }
        } else {
            dispatch({type: types.SENT_COMMAND, error: 'Invalid CMDServer Config'})
        }
    };
};

export {fetchCommands, sendCommand};