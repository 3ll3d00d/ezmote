import * as types from '../actionTypes';
import * as uut from '../actions';
import jriver from '../../../services/jriver';
import poller from '../../../services/timer';
import * as zd from "../__data__";
import {Thunk} from "redux-testkit";
import * as configTypes from "../../config/config";
import {InvalidConfigError} from "../../config/reducer";

jest.mock('../../../services/jriver');
jest.mock('../../../services/timer');

describe('store/jriver/actions', () => {

    const goodConfig = {
        [configTypes.MC_USE_SSL]: false,
        [configTypes.MC_HOST]: 'mchost',
        [configTypes.MC_PORT]: 52199,
        [configTypes.MC_USERNAME]: 'mcusername',
        [configTypes.MC_PASSWORD]: 'mcpassword',
        valid: true
    };

    const basicZones = zd.zones(zd.zone(10001, 'Music'), zd.zone(10002, 'Films'));
    const withActive1 = zd.zones(zd.withActive(zd.zone(10001, 'Music')), zd.zone(10002, 'Films'));
    const withActive2 = zd.zones(zd.zone(10001, 'Music'), zd.withActive(zd.zone(10002, 'Films')));

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('fetchZones', () => {

        it('should get zones when nothing is active', async () => {
            jriver.invoke.mockReturnValueOnce(basicZones.zones);
            const dispatches = await Thunk(uut.fetchZones)
                .withState({config: goodConfig, jriver: {zones: {}}})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.FETCH_ZONES, payload: basicZones.zones});
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

        it('should start a poller when a zone goes active', async () => {
            jriver.invoke.mockReturnValueOnce(withActive1.zones);
            const dispatches = await Thunk(uut.fetchZones)
                .withState({config: goodConfig, jriver: {zones: {}}})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.FETCH_ZONES, payload: withActive1.zones});
            expect(poller.startPolling).toHaveBeenCalledTimes(1);
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

        it('should stop a poller when a zone goes inactive', async () => {
            jriver.invoke.mockReturnValueOnce(basicZones.zones);
            poller.stopPolling.mockReturnValue(true);
            const dispatches = await Thunk(uut.fetchZones)
                .withState({config: goodConfig, jriver: {zones: withActive1.zones}})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.FETCH_ZONES, payload: basicZones.zones});
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).toHaveBeenCalledTimes(1);
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

        it('should replace the poller when the active zone changes', async () => {
            jriver.invoke.mockReturnValueOnce(withActive2.zones);
            poller.stopPolling.mockReturnValue(true);
            const dispatches = await Thunk(uut.fetchZones)
                .withState({config: goodConfig, jriver: {zones: withActive1.zones}})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.FETCH_ZONES, payload: withActive2.zones});
            expect(poller.startPolling).toHaveBeenCalledTimes(1);
            expect(poller.stopPolling).toHaveBeenCalledTimes(1);
            expect(poller.isPolling).not.toHaveBeenCalled();
        });
    });

    describe('fetchZoneInfo', () => {

        it('should get zone info', async () => {
            const enriched1 = zd.enriched(zd.enrichedData, zd.zone(10001, 'Music'));
            jriver.invoke.mockReturnValueOnce(enriched1);
            const dispatches = await Thunk(uut.fetchZoneInfo).withState({config: goodConfig, jriver: {zones: {}}}).execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({
                type: types.FETCH_ZONE_INFO,
                payload: enriched1
            });
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });
        // TODO should dispatch when the zone transitions to stopped
    });

    describe('setVolume', () => {

        it('should set volume', async () => {
            const enriched1 = zd.enriched(zd.enrichedData, zd.zone(10001, 'Music'));
            jriver.invoke.mockReturnValueOnce(0.15);
            const dispatches = await Thunk(() => uut.setVolume(10001)).withState({
                config: goodConfig,
                jriver: {jriver: {zones: enriched1}}
            }).execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({
                type: types.SET_VOLUME,
                payload: {
                    volumeRatio: 0.15,
                    zoneId: 10001
                }
            });
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });
    });

    describe('mute', () => {

        it('should mute a zone', async () => {
            const enriched1 = zd.enriched(zd.enrichedData, zd.zone(10001, 'Music'));
            jriver.invoke.mockReturnValueOnce(true);
            const dispatches = await Thunk(() => uut.muteVolume(10001)).withState({
                config: goodConfig,
                jriver: {zones: enriched1}
            }).execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({
                type: types.MUTE_VOLUME,
                payload: {muted: true, zoneId: 10001}
            });
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

        it('should unmute a zone', async () => {
            const enriched1 = zd.enriched(zd.enrichedData, zd.zone(10001, 'Music'));
            jriver.invoke.mockReturnValueOnce(false);
            const dispatches = await Thunk(() => uut.unmuteVolume(10001)).withState({
                config: goodConfig,
                jriver: {zones: enriched1}
            }).execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({
                type: types.UNMUTE_VOLUME,
                payload: {muted: false, zoneId: 10001}
            });
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

    });

    describe('alive', () => {
        it('should report server state', async () => {
            jriver.invoke.mockReturnValueOnce({serverName: 'hello', version: '23.0.92'});
            const dispatches = await Thunk(uut.isAlive).withState({config: goodConfig, jriver: {}}).execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({
                type: types.IS_ALIVE,
                payload: {serverName: 'hello', version: '23.0.92'}
            });
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });
    });

    describe('auth', () => {
        it('should provide an auth token', async () => {
            jriver.invoke.mockReturnValueOnce('abcdefg');
            const dispatches = await Thunk(uut.authenticate).withState({config: goodConfig, jriver: {}}).execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({
                type: types.AUTHENTICATE,
                payload: 'abcdefg'
            });
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });
    });

    describe('generic failure handling', () => {
        const enriched1 = zd.enriched(zd.enrichedData, zd.zone(10001, 'Music'));
        const tests = {
            'mute volume': {
                func: uut.muteVolume,
                errorType: types.MUTE_VOLUME_FAIL
            },
            'unmute volume': {
                func: uut.unmuteVolume,
                errorType: types.UNMUTE_VOLUME_FAIL
            },
            'set volume': {
                func: uut.setVolume,
                errorType: types.SET_VOLUME_FAIL
            },
            'fetch zones': {
                func: uut.fetchZones,
                errorType: types.FETCH_ZONES_FAIL
            },
            'fetch zone info': {
                func: uut.fetchZoneInfo,
                errorType: types.FETCH_ZONE_INFO_FAIL
            },
            'alive': {
                func: uut.isAlive,
                errorType: types.IS_ALIVE_FAIL
            },
            'auth': {
                func: uut.authenticate,
                errorType: types.AUTHENTICATE_FAIL
            }
        };
        Object.keys(tests).forEach(test => {
            it(`${test} should fail when jriver blows`, async () => {
                const errorThrownByJRiver = new Error("JRiver Blew Up");
                jriver.invoke.mockImplementation(() => {
                    throw errorThrownByJRiver;
                });
                const dispatches = await Thunk(tests[test].func).withState({
                    config: goodConfig,
                    jriver: {zones: enriched1}
                }).execute();
                expect(jriver.invoke.mock.calls.length).toBe(1);
                expect(dispatches.length).toBe(1);
                expect(dispatches[0].getAction()).toEqual({
                    type: tests[test].errorType,
                    error: true,
                    payload: errorThrownByJRiver
                });
                expect(poller.startPolling).not.toHaveBeenCalled();
                expect(poller.stopPolling).not.toHaveBeenCalled();
                expect(poller.isPolling).not.toHaveBeenCalled();
            });

            it(`${test} should fail when the config is bad`, async () => {
                const dispatches = await Thunk(tests[test].func).withState({
                    config: {valid: false},
                    jriver: {zones: enriched1}
                }).execute();
                expect(jriver.invoke.mock.calls.length).toBe(0);
                expect(dispatches.length).toBe(1);
                expect(dispatches[0].getAction()).toMatchObject({
                    type: tests[test].errorType,
                    error: true,
                    payload: expect.any(InvalidConfigError)
                });
                expect(poller.startPolling).not.toHaveBeenCalled();
                expect(poller.stopPolling).not.toHaveBeenCalled();
                expect(poller.isPolling).not.toHaveBeenCalled();
            });
        });
    });
});

