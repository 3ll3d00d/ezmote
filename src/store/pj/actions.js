import * as types from "./actionTypes";
import cmdserver from '../../services/cmdserver';

const PJ_SEND_COMMAND = 'send';
const PJ_GET_DATA = 'get';

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

const getData = (type, cmd) => {
    return async (dispatch, getState) => {
        try {
            dispatch({type: types.REQUEST_DATA, payload: {pending: cmd}})
            const response = await cmdserver.getPJData(cmd);
            dispatch({type: types.GET_DATA, payload: {response: response.trim().replaceAll('"', ''), cmd}});
        } catch (error) {
            dispatchError(dispatch, types.GET_DATA_FAIL, error);
        }
    };
};

/**
 * Sends a command to the projector.
 * @param command the command.
 */
const sendCommandToPJ = (command) => sendCommand(PJ_SEND_COMMAND, command);

/**
 * gets some state from the projector.
 * @param command the command.
 */
const getDataFromPJ = (command) => getData(PJ_GET_DATA, command);

const getAnamorphicModeFromPJ = () => getDataFromPJ("Anamorphic");

const getPictureModeFromPJ = () => getDataFromPJ("PictureMode");

const getInstallationModeFromPJ = () => getDataFromPJ("InstallationMode");

const getPowerStateFromPJ = () => getDataFromPJ("Power");

const clearState = (cmd) => {
    return {type: types.GET_DATA, payload: {response: '', cmd}};
}

const clearPowerState = () => clearState('Power');

const clearAnamorphicState = () => clearState('Anamorphic');

const clearPictureModeState = () => clearState('PictureMode');

const clearInstallationModeState = () => clearState('InstallationMode');

export {
    sendCommandToPJ,
    getDataFromPJ,
    getAnamorphicModeFromPJ,
    getPowerStateFromPJ,
    getPictureModeFromPJ,
    getInstallationModeFromPJ,
    clearPowerState,
    clearAnamorphicState,
    clearPictureModeState,
    clearInstallationModeState
};