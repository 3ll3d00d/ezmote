import * as types from "./actionTypes";
import cmdserver from '../../services/cmdserver';
import {getActiveZone} from "../jriver/reducer";

const dispatchError = (dispatch, type, error) => {
    dispatch({type: type, error: true, payload: `${error.name} - ${error.message}`});
};

/**
 * Gets whatever is playing now.
 * @returns {function(*=, *)}
 */
const fetchPlayingNow = () => {
    return async (dispatch, getState) => {
        try {
            const activeZone = getActiveZone(getState());
            let playingNow = null;
            if (activeZone) {
                if (activeZone.externalSource) {
                    playingNow = await cmdserver.getPlayingNow();
                } else {
                    playingNow = activeZone.name;
                }
            }
            dispatch({type: types.GET_PLAYING_NOW, payload: playingNow});
        } catch (error) {
            dispatchError(dispatch, types.GET_PLAYING_NOW_FAIL, error);
        }
    };
};

export {fetchPlayingNow};