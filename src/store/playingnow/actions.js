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
            if (activeZone) {
                if (activeZone.playingNow && activeZone.playingNow.externalSource) {
                    const values = await cmdserver.getPlayingNow();
                    if (values) {
                        if (values.hasOwnProperty('title')) {
                            dispatch({type: types.GET_PLAYING_NOW, payload: values.title});
                        } else if (values.hasOwnProperty('id')) {
                            dispatchError(dispatch, types.GET_PLAYING_NOW_FAIL,
                                new Error(`Unknown playingNow window found with id ${values.id}`));
                        } else {
                            dispatchError(dispatch, types.GET_PLAYING_NOW_FAIL,
                                new Error(`Unknown playingNow response ${JSON.stringify(values.id)}`));
                        }
                    }
                } else {
                    dispatch({type: types.GET_PLAYING_NOW, payload: activeZone.name});
                }
            }
        } catch (error) {
            dispatchError(dispatch, types.GET_PLAYING_NOW_FAIL, error);
        }
    };
};

export {fetchPlayingNow};