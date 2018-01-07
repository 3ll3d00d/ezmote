import _ from 'lodash';
import * as types from "./actionTypes";
import cmdserver from '../../services/cmdserver';
import {getConfig} from "../config/reducer";

const TIVO_KEYBOARD_COMMAND = 'keyboard';
const TIVO_IR_COMMAND = 'ir';
const TIVO_SETCH_COMMAND = 'setch';

const dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: true, payload: `${error.name} - ${error.message}`});
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
                dispatchError(dispatch, types.COMMANDS_FETCHED_FAIL, error);
            }
        } else {
            dispatch({type: types.COMMANDS_FETCHED, error: true, payload: 'Invalid CMDServer Config'})
        }
    };
};

/**
 * Sends the command.
 * @param commandId
 * @returns {function(*=, *)}
 */
const sendCommand = (commandId) => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getConfig(state);
        if (config.valid) {
            try {
                const response = await cmdserver.sendCommand(config, commandId);
                dispatch({type: types.SEND_COMMAND, payload: response});
            } catch (error) {
                dispatchError(dispatch, types.SEND_COMMAND_FAIL, error);
            }
        } else {
            dispatch({type: types.SEND_COMMAND_FAIL, error: true, payload: 'Invalid CMDServer Config'})
        }
    };
};

const sendTivoKey = (type, key) => {
    return async (dispatch, getState) => {
        const state = getState();
        const config = getConfig(state);
        if (config.valid) {
            try {
                const response = await cmdserver.sendTivoCommand(config, type, key);
                dispatch({type: types.SEND_TIVO_KEY, payload: response});
            } catch (error) {
                dispatchError(dispatch, types.SEND_TIVO_KEY_FAIL, error);
            }
        } else {
            dispatch({type: types.SEND_TIVO_KEY_FAIL, error: true, payload: 'Invalid CMDServer Config'})
        }
    };
};

/**
 * Sends a text string to the tivo.
 * @param text the text.
 */
const sendTextToTivo = (text) => sendTivoKey(TIVO_KEYBOARD_COMMAND, text);

/**
 * Sends an IR command to the tivo.
 * @param command the ir command.
 */
const sendIRToTivo = (command) => sendTivoKey(TIVO_IR_COMMAND, command);

/**
 * Sets the TiVo channel.
 * @param channelNumber the channel number.
 */
const setTivoChannel = (channelNumber) => sendTivoKey(TIVO_SETCH_COMMAND, channelNumber);

export {fetchCommands, sendCommand, sendTextToTivo, sendIRToTivo, setTivoChannel};