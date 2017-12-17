import * as types from "./actionTypes";
import jriver from '../../services/jriver';

/**
 * a thunk which asynchronously fetches zone information.
 * @returns {function(*, *)}
 */
const fetchZones = () => {
    return async (dispatch, getState) => {
        try {
            const zones = await jriver.getZones();
            dispatch({type: types.ZONES_FETCHED, zones});
        } catch (error) {
            console.error(error);
        }
    };
};

export {fetchZones};