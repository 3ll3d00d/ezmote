import keyBy from 'lodash.keyby';
import * as types from "./actionTypes";
import cmdserver from '../../services/cmdserver';
import {activateZone, setVolume, stopAllPlaying} from "../jriver/actions";

const dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: true, payload: `${error.name} - ${error.message}`});
};

/**
 * a thunk which asynchronously fetches the commands.
 * @returns {function(*, *)}
 */
const fetchCommands = () => {
    return async (dispatch) => {
        try {
            const commands = await cmdserver.getCommands();
            const byId = keyBy(commands, 'id');
            dispatch({type: types.COMMANDS_FETCHED, payload: byId});
        } catch (error) {
            dispatchError(dispatch, types.COMMANDS_FETCHED_FAIL, error);
        }
    };
};

/**
 * Sends the command.
 * @param command the command.
 * @returns {function(*=, *)}
 */
const sendCommand = (command) => {
    return async (dispatch, getState) => {
        if (command.hasOwnProperty('stopAll') && command.stopAll) {
            dispatch(stopAllPlaying());
        }
        if (command.hasOwnProperty('zoneId')) {
            dispatch(activateZone(command.zoneId));
        }
        if (command.hasOwnProperty('volume')) {
            dispatch(setVolume(command.zoneId, command.volume));
        }
        try {
            const response = await cmdserver.sendCommand(command.id);
            dispatch({type: types.SEND_COMMAND, payload: response});
        } catch (error) {
            dispatchError(dispatch, types.SEND_COMMAND_FAIL, error);
        }
    };
};

export {fetchCommands, sendCommand};
