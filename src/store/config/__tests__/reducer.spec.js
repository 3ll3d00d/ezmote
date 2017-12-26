import reduce, { initialState, getConfig } from "../reducer";
import {MC_USE_SSL, MC_USERNAME, MC_HOST, MC_PASSWORD, MC_PORT, CMDSERVER_PORT} from "../config";
import {Reducer, Selector} from 'redux-testkit';
import * as actionTypes from '../actionTypes';
import Immutable from 'seamless-immutable';

describe('store/config/reducer', () => {
    const validatedInitialState = Immutable.merge(initialState, {
        error: "Missing values: mcusername,mcpassword",
        valid: false
    });

    it('should have initial state', () => {
        expect(reduce()).toEqual(validatedInitialState);
    });

    it('should return the same state after accepting a non existing action', () => {
        Reducer(reduce).withState(validatedInitialState).expect({type: 'SOME_RANDOM_ACTION'}).toReturnState(validatedInitialState);
    });

    it('should handle config update to initial state', () => {
        const updatedValue = {field: 'key1', value: 'value1'};
        const action = {type: actionTypes.CONFIG_VALUE_UPDATE, payload: updatedValue};
        const expectedValue = validatedInitialState.merge({key1: 'value1'});
        Reducer(reduce).expect(action).toReturnState(expectedValue);
    });

    it('should handle config update to existing state', () => {
        const updatedValue = {field: 'key1', value: 'value11'};
        const action = {type: actionTypes.CONFIG_VALUE_UPDATE, payload: updatedValue};
        const state1 = validatedInitialState.merge({key1: 'value10'});
        const state2 = validatedInitialState.merge({key1: 'value11'});
        Reducer(reduce).withState(state1).expect(action).toReturnState(state2);
    });

    it('should handle config update to existing state on a separate key', () => {
        const updatedValue = {field: 'key2', value: 'value20'};
        const action = {type: actionTypes.CONFIG_VALUE_UPDATE, payload: updatedValue};
        const state1 = validatedInitialState.merge({key1: 'value1'});
        const state2 = validatedInitialState.merge({key1: 'value1', key2: 'value20'});
        Reducer(reduce).withState(state1).expect(action).toReturnState(state2);
    });

});

describe('store/zone/selectors', () => {

    it('should select the config', () => {
        const expected = {
            [MC_USE_SSL]: false,
            [MC_HOST]: 'localhost',
            [MC_PORT]: 52199,
            [MC_USERNAME]: '',
            [MC_PASSWORD]: '',
            [CMDSERVER_PORT]: 53199
        };
        Selector(getConfig).expect({config: initialState}).toReturn(expected);
    });

});