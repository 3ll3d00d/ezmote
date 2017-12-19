import * as types from '../actionTypes';
import * as uut from '../actions';
import jriverService from '../../../services/jriver';
import {basicZones, enrichedZone1} from "./reducer.spec";
import {Thunk} from "redux-testkit";

jest.mock('../../../services/jriver');

describe('store/zones/actions', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should get zones', async () => {
        jriverService.getZones.mockReturnValueOnce(basicZones.zones);
        const config = {user: 'me', pass: 'you', url: 'hello'};
        const dispatches = await Thunk(uut.fetchZones).withState(config).execute();
        expect(dispatches.length).toBe(1);
        expect(dispatches[0].getAction()).toEqual({type: types.ZONES_FETCHED, payload: basicZones.zones});
    });

    it('should get zone info', async () => {
        jriverService.getZoneInfo.mockReturnValueOnce(enrichedZone1.zones[10001]);
        const config = {user: 'me', pass: 'you', url: 'hello'};
        const dispatches = await Thunk(uut.fetchZoneInfo).withState(config).execute();
        expect(dispatches.length).toBe(1);
        expect(dispatches[0].getAction()).toEqual({type: types.ZONE_INFO_FETCHED, payload: enrichedZone1.zones[10001]});
    });
});