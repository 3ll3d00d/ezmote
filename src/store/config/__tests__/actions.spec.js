import * as types from '../actionTypes';
import * as uut from '../actions';

describe('store/config/actions', () => {

    it('should create an action to update config', () => {
        const expectedAction = {
            type: types.CONFIG_VALUE_UPDATE,
            payload: {
                field: 'key1', value: 'value1'
            }
        };
        expect(uut.updateValue('key1', 'value1')).toEqual(expectedAction);
    });
});