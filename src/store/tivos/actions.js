import * as types from "./actionTypes";
import cmdserver from '../../services/cmdserver';
import {getTivoName} from "../config/reducer";

const TIVO_KEYBOARD_COMMAND = 'keyboard';
const TIVO_IR_COMMAND = 'ir';
const TIVO_SETCH_COMMAND = 'setch';

const dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: true, payload: `${error.name} - ${error.message}`});
};

const getTivoInfo = () => {
    return async (dispatch, getState) => {
        const state = getState();
        const tivoName = getTivoName(state);
        if (tivoName) {
            try {
                const response = await cmdserver.getTivoInfo(tivoName);
                dispatch({type: types.GET_TIVO_INFO, payload: response});
            } catch (error) {
                dispatchError(dispatch, types.GET_TIVO_INFO_FAIL, error);
            }
        } else {
            dispatch({type: types.GET_TIVO_INFO_FAIL, error: true, payload: 'Invalid CMDServer Config'})
        }
    };
};

const sendTivoKey = (type, key) => {
    return async (dispatch, getState) => {
        const state = getState();
        const tivoName = getTivoName(state);
        if (tivoName) {
            try {
                const response = await cmdserver.sendTivoCommand(tivoName, type, key);
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

export {sendTextToTivo, sendIRToTivo, setTivoChannel, getTivoInfo};