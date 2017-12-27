import reduce, {getActiveZone, getAllZones, initialState} from "../reducer";
import {Reducer, Selector} from 'redux-testkit';
import * as actionTypes from '../actionTypes';
import Immutable from 'seamless-immutable';
import * as zd from "../__data__";


describe('store/zones/reducer', () => {

    it('should have initial state', () => {
        expect(reduce()).toEqual(initialState);
    });

    it('should return the same state after accepting a non existing action', () => {
        Reducer(reduce).withState(initialState).expect({type: 'SOME_RANDOM_ACTION'}).toReturnState(initialState);
    });

    describe('zones', () => {

        it('should handle load of zones into initial state', () => {
            const basicZones = zd.zones(zd.zone(10001, 'Music'), zd.zone(10002, 'Films'));
            const action = {type: actionTypes.FETCH_ZONES, payload: basicZones.zones};
            const expectedValue = Immutable(basicZones.zones);
            Reducer(reduce).expect(action).toReturnState(expectedValue);
        });

        it('should handle merge of zones into existing state', () => {
            const basicZones = zd.zones(zd.zone(10001, 'Music'), zd.zone(10002, 'Films'));
            const enrichedZones = zd.zones(zd.zone(10001, 'Music'), zd.enriched(zd.enrichedData, zd.zone(10002, 'Films')));
            const action = {type: actionTypes.FETCH_ZONES, payload: basicZones.zones};
            Reducer(reduce)
                .withState(Immutable(enrichedZones.zones))
                .expect(action)
                .toReturnState(Immutable(enrichedZones.zones));
        });

        it('should handle a deleted zone', () => {
            const basicZones = zd.zones(zd.zone(10001, 'Music'), zd.zone(10002, 'Films'));
            const deletedZones = zd.zones(zd.zone(10001, 'Music'));
            const action = {type: actionTypes.FETCH_ZONES, payload: deletedZones.zones};
            Reducer(reduce)
                .withState(Immutable(basicZones.zones))
                .expect(action)
                .toReturnState(Immutable(deletedZones.zones));

        });
    });

    describe('zone info', () => {

        it('should handle initial zone info', () => {
            const basicZones = zd.zones(zd.zone(10001, 'Music'), zd.zone(10002, 'Films'));
            const enrichedZones = zd.zones(zd.enriched(zd.enrichedData, zd.zone(10001, 'Music')), zd.zone(10002, 'Films'));
            const action = {
                type: actionTypes.FETCH_ZONE_INFO, payload: {
                    id: 10001,
                    name: 'Music',
                    volumeRatio: 0.31,
                    volumedb: -31,
                    fileKey: '123456',
                    imageURL: 'URL 1234'
                }
            };
            Reducer(reduce).withState(Immutable(basicZones.zones))
                .expect(action)
                .toReturnState(Immutable(enrichedZones.zones));
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
            const enrichedZones = zd.zones(zd.enriched(zd.enrichedData, zd.zone(10001, 'Music')), zd.zone(10002, 'Films'));
            const action = {type: actionTypes.FETCH_ZONE_INFO, payload: updatedPayload};
            const updatedZone1 = Immutable({
                zones: {
                    10001: updatedPayload,
                    10002: {
                        id: 10002,
                        name: 'Films'
                    }
                }
            });
            Reducer(reduce).withState(enrichedZones.zones).expect(action).toReturnState(updatedZone1.zones);
        });

        it('zone info with no name does not trash existing state', () => {
            const basicZones = zd.zones(zd.zone(10001, 'Music'));
            const enrichedZones = zd.zones(zd.enriched(zd.enrichedData, zd.zone(10001, 'Music')));
            const action = {
                type: actionTypes.FETCH_ZONE_INFO, payload: {
                    id: 10001,
                    volumeRatio: 0.31,
                    volumedb: -31,
                    fileKey: '123456',
                    imageURL: 'URL 1234'
                }
            };
            Reducer(reduce).withState(Immutable(basicZones.zones))
                .expect(action)
                .toReturnState(Immutable(enrichedZones.zones));
        });
    });

    describe('set volume', () => {
        it('volume is updated', () => {
            const enrichedZones = zd.zones(zd.enriched(zd.enrichedData, zd.zone(10001, 'Music')), zd.zone(10002, 'Films'));
            const action = {
                type: actionTypes.SET_VOLUME, payload: {
                    zoneId: 10001,
                    volumeRatio: 0.82
                }
            };
            const updatedZone1 = Immutable({
                zones: {
                    10001: Object.assign({}, enrichedZones.zones[10001], {volumeRatio: 0.82}),
                    10002: {
                        id: 10002,
                        name: 'Films'
                    }
                }
            });
            Reducer(reduce).withState(enrichedZones.zones).expect(action).toReturnState(updatedZone1.zones);
        });
    });

    describe('mute', () => {
        for (let muted in [true, false]) {
            it(`volume is ${muted ? 'muted' : 'unmuted'}`, () => {
                const enrichedZones = zd.zones(zd.enriched(zd.enrichedData, zd.zone(10001, 'Music')), zd.zone(10002, 'Films'));
                const action = {type: actionTypes.MUTE_VOLUME, payload: {
                        zoneId: 10001,
                        muted: muted
                    }};
                const updatedZone1 = Immutable({
                    zones: {
                        10001: Object.assign({}, enrichedZones.zones[10001], {muted: muted}),
                        10002: {
                            id: 10002,
                            name: 'Films'
                        }
                    }
                });
                Reducer(reduce).withState(enrichedZones.zones).expect(action).toReturnState(updatedZone1.zones);
            });
        }

    });
});

describe('store/zone/selectors', () => {

    it('should select no zones', () => {
        Selector(getAllZones).expect({zones: initialState}).toReturn({});
    });

    it('should select known zones', () => {
        const enrichedZones = zd.zones(zd.enriched(zd.enrichedData, zd.zone(10001, 'Music')), zd.zone(10002, 'Films'));
        Selector(getAllZones).expect(enrichedZones).toReturn(enrichedZones.zones);
    });

    it('should select the active zone', () => {
        const enrichedZones = zd.zones(zd.enriched(zd.enrichedData, zd.zone(10001, 'Music')), zd.withActive(zd.zone(10002, 'Films')));
        Selector(getActiveZone).expect(enrichedZones).toReturn(enrichedZones.zones[10002]);
    });

});