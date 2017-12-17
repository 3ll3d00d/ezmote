import * as types from "./actionTypes";

const fetchZones = () => {
    return async(dispatch, getState) => {
        try {
            const xmlZones = await jriver.getZones();
            const jsonZones = xmlZones;
            dispatch({ type: types.ZONES_FETCHED, jsonZones });
        } catch (error) {
            console.error(error);
        }
    };
};

export {fetchZones};