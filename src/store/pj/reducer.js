import * as types from './actionTypes';
import Immutable from 'seamless-immutable';

import {makeError} from "../errors";

export const initialState = Immutable({
    Anamorphic: '',
    Power: '',
    PictureMode: '',
    InstallationMode: '',
    Pending: '',
    LastUpdate: 0
});

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.SEND_COMMAND:
            return Immutable.without(state, 'keyError');
        case types.SEND_COMMAND_FAIL:
            return Immutable.set(state, {keyError: makeError(action)});
        case types.GET_DATA:
            return Immutable.merge(
                Immutable.without(state, 'getError'),
                {
                    [action.payload.cmd]: action.payload.response,
                    LastUpdate: Date.now(),
                    Pending: ''
                }
            );
        case types.GET_DATA_FAIL:
            return Immutable.set(state, {getError: makeError(action), LastUpdate: Date.now()});
        case types.REQUEST_DATA:
            return Immutable.set(state, {'Pending': action.payload.cmd})
        default:
            return state;
    }
};

// selector functions
const errors = state => {
    return {
        key: state.keyError,
        get: state.getError
    };
};

const anamorphicMode = state => state.pj.Anamorphic;
const pictureMode = state => state.pj.PictureMode;
const powerState = state => state.pj.Power;
const installationMode = state => state.pj.InstallationMode;
const lastUpdate = state => state.pj.LastUpdate;
const pending = state => state.pj.Pending;

export const getErrors = errors;
export const getAnamorphicMode = anamorphicMode;
export const getPictureMode = pictureMode;
export const getInstallationMode = installationMode;
export const getPowerState = powerState;
export const getPending = pending;
export const getLastUpdateMillis = lastUpdate;

export default reduce;