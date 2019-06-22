import * as types from "./actionTypes";
import cmdserver from '../../services/cmdserver';

const PJ_SEND_COMMAND = 'send';
// const PJ_GET_COMMAND = 'get';

const dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: true, payload: `${error.name} - ${error.message}`});
};

const sendCommand = (type, cmd) => {
    return async (dispatch, getState) => {
        try {
            const response = await cmdserver.sendPJCommand(cmd);
            dispatch({type: types.SEND_COMMAND, payload: response});
        } catch (error) {
            dispatchError(dispatch, types.SEND_COMMAND_FAIL, error);
        }
    };
};

/**
 * Sends a command to the projector.
 * @param command the command.
 */
const sendCommandToPJ = (command) => sendCommand(PJ_SEND_COMMAND, command);

// /**
//  * Gets a value from the PJ.
//  * @param command the  command.
//  */
// const getStateFromPJ = (command) => sendCommand(PJ_GET_COMMAND, command);

export { sendCommandToPJ};