import * as types from '../actionTypes';
import * as uut from '../actions';
import jriver from '../../../services/jriver';
import * as zd from "../__data__";
import {Thunk} from "redux-testkit";
import * as configTypes from "../../config/config";
import {describe, it, expect} from 'vitest';

vi.mock('../../../services/jriver', () => {
    const JRiver = vi.fn();
    JRiver.prototype.invoke = vi.fn();
    return { default: JRiver };
});

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
            });
        });
    });
});

