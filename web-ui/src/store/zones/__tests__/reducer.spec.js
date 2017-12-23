import reduce, {initialState, getAllZones} from "../reducer";
import {Reducer, Selector} from 'redux-testkit';
import * as actionTypes from '../actionTypes';
import Immutable from 'seamless-immutable';

export const basicZones = {
    zones: {
        10001: {
            id: 10001,
            name: 'Music'
        },
        10002: {
            id: 10002,
            name: 'Films'
        }
    }
};

export const enrichedZone1 = Immutable({
    zones: {
        10001: {
            id: 10001,
            name: 'Music',
            volumeRatio: 0.31,
            volumedb: -31,
            fileKey: '123456',
            imageURL: 'URL 1234'
        },
        10002: {
            id: 10002,
            name: 'Films'
        }
    }
});

describe('store/zones/reducer', () => {

    it('should have initial state', () => {
        expect(reduce()).toEqual(initialState);
    });

    it('should return the same state after accepting a non existing action', () => {
        Reducer(reduce).withState(initialState).expect({type: 'SOME_RANDOM_ACTION'}).toReturnState(initialState);
    });

    describe('zones', () => {

        it('should handle load of zones into initial state', () => {
            const action = {type: actionTypes.ZONES_FETCHED, payload: basicZones.zones};
            const expectedValue = Immutable({zones: basicZones.zones});
            Reducer(reduce).expect(action).toReturnState(expectedValue);
        });

        it('should handle merge of zones into existing state', () => {
            const action = {type: actionTypes.ZONES_FETCHED, payload: basicZones.zones};
            Reducer(reduce).withState(enrichedZone1).expect(action).toReturnState(enrichedZone1);
        });
    });

    describe('zone info', () => {

        it('should handle initial zone info', () => {
            const action = {
                type: actionTypes.ZONE_INFO_FETCHED, payload: {
                    id: 10001,
                    name: 'Music',
                    volumeRatio: 0.31,
                    volumedb: -31,
                    fileKey: '123456',
                    imageURL: 'URL 1234'
                }
            };
            Reducer(reduce).withState(basicZones).expect(action).toReturnState(enrichedZone1);
        });

        it('should handle fresh zone info', () => {
            const updatedPayload = {
                id: 10001,
                name: 'Music',
                volumeRatio: 0.35,
                volumedb: -25,
                fileKey: '654321',
                imageURL: 'URL 654321'
            };
            const action = {type: actionTypes.ZONE_INFO_FETCHED, payload: updatedPayload};
            const updatedZone1 = Immutable({
                zones: {
                    10001: updatedPayload,
                    10002: {
                        id: 10002,
                        name: 'Films'
                    }
                }
            });
            Reducer(reduce).withState(enrichedZone1).expect(action).toReturnState(updatedZone1);
        });

    });

});

describe('store/zone/selectors', () => {

    it('should select no zones', () => {
        const expected = Immutable({});
        Selector(getAllZones).expect(initialState).toReturn(expected);
    });

    it('should select known zones', () => {
        Selector(getAllZones).expect(enrichedZone1).toReturn(enrichedZone1.zones);
    });

});