import * as types from './actionTypes';
import Immutable from 'seamless-immutable';
import {makeError} from "../store";

export const initialState = Immutable({active: 'Music', error: null});

/**
 * Reduces the standard flux action for zone action types into the store.
 * @param state the state.
 * @param action the action.
 * @returns {*} the new state.
 */
const reduce = (state = initialState, action = {}) => {
    switch (action.type) {
        case types.GET_PLAYING_NOW:
            return Immutable.set(state, 'active', action.payload);
        case types.GET_PLAYING_NOW_FAIL:
            return Immutable.set(state, 'error', makeError(action));
        default:
            return state;
    }
};

// selector functions
const playingNow = state => state.playingnow.active;
const errors = state => state.playingnow.error;
export const getErrors = errors;
export const getPlayingNow = playingNow;

export default reduce;