import * as types from '../actionTypes';
import * as uut from '../actions';
import jriver from '../../../services/jriver';
import poller from '../../../services/timer';
import * as zd from "../__data__";
import {Thunk} from "redux-testkit";
import * as configTypes from "../../config/config";

jest.mock('../../../services/jriver');
jest.mock('../../../services/timer');

describe('store/zones/actions', () => {

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
                .withState({config: goodConfig, zones: {}})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.ZONES_FETCHED, payload: basicZones.zones});
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

        it('should start a poller when a zone goes active', async () => {
            jriver.invoke.mockReturnValueOnce(withActive1.zones);
            const dispatches = await Thunk(uut.fetchZones)
                .withState({config: goodConfig, zones: {}})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.ZONES_FETCHED, payload: withActive1.zones});
            expect(poller.startPolling).toHaveBeenCalledTimes(1);
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

        it('should stop a poller when a zone goes inactive', async () => {
            jriver.invoke.mockReturnValueOnce(basicZones.zones);
            const dispatches = await Thunk(uut.fetchZones)
                .withState({config: goodConfig, zones: withActive1.zones})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.ZONES_FETCHED, payload: basicZones.zones});
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).toHaveBeenCalledTimes(1);
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

        it('should replace the poller when the active zone changes', async () => {
            jriver.invoke.mockReturnValueOnce(withActive2.zones);
            const dispatches = await Thunk(uut.fetchZones)
                .withState({config: goodConfig, zones: withActive1.zones})
                .execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({type: types.ZONES_FETCHED, payload: withActive2.zones});
            expect(poller.startPolling).toHaveBeenCalledTimes(1);
            expect(poller.stopPolling).toHaveBeenCalledTimes(1);
            expect(poller.isPolling).not.toHaveBeenCalled();
        });
    });

    describe('fetchZoneInfo', () => {

        it('should get zone info', async () => {
            const enriched1 = zd.enriched(zd.enrichedData, zd.zone(10001, 'Music'));
            jriver.invoke.mockReturnValueOnce(enriched1);
            const dispatches = await Thunk(uut.fetchZoneInfo).withState({config: goodConfig, zones: {}}).execute();
            expect(jriver.invoke.mock.calls.length).toBe(1);
            expect(dispatches.length).toBe(1);
            expect(dispatches[0].getAction()).toEqual({
                type: types.ZONE_INFO_FETCHED,
                payload: enriched1
            });
            expect(poller.startPolling).not.toHaveBeenCalled();
            expect(poller.stopPolling).not.toHaveBeenCalled();
            expect(poller.isPolling).not.toHaveBeenCalled();
        });

    });
});