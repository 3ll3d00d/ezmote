import jriver from '../index';
import * as configTypes from '../../../store/config/config';
import * as mcws from '../mcws';

global.fetch = require('jest-fetch-mock');

describe('services/jriver', () => {

    const goodConfig = {
        [configTypes.MC_USE_SSL]: false,
        [configTypes.MC_HOST]: 'mchost',
        [configTypes.MC_PORT]: 52199,
        [configTypes.MC_USERNAME]: 'mcusername',
        [configTypes.MC_PASSWORD]: 'mcpassword'
    };

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getAllZones', () => {

        it('should get data', async () => {
            fetch.mockResponseOnce(manyZones);
            const response = await jriver.invoke(mcws.playbackZones(goodConfig));
            expect(response).toEqual([
                {id: '10002', name: 'Music', active: false},
                {id: '10009', name: 'Films', active: true},
                {id: '10015', name: 'Tivo & Netflix', active: false},
            ]);
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            let error;
            try {
                await jriver.invoke(mcws.playbackZones(goodConfig));
            } catch (e) {
                error = e;
            }
            expect(error.message).toMatch(/^Bad response .*/);
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.invoke(mcws.playbackZones(goodConfig));
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.GET_ZONES failed, HTTP status 500'));
        });
    });

});

const manyZones =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"OK\">\n" +
    "    <Item Name=\"NumberZones\">3</Item>\n" +
    "    <Item Name=\"CurrentZoneID\">10009</Item>\n" +
    "    <Item Name=\"CurrentZoneIndex\">1</Item>\n" +
    "    <Item Name=\"ZoneName0\">Music</Item>\n" +
    "    <Item Name=\"ZoneID0\">10002</Item>\n" +
    "    <Item Name=\"ZoneGUID0\">{1C69970D-1669-4A35-8489-D72807265126}</Item>\n" +
    "    <Item Name=\"ZoneDLNA0\">0</Item>\n" +
    "    <Item Name=\"ZoneName1\">Films</Item>\n" +
    "    <Item Name=\"ZoneID1\">10009</Item>\n" +
    "    <Item Name=\"ZoneGUID1\">{7EE0DF13-E080-46A1-9F38-8BE1FD9F36DB}</Item>\n" +
    "    <Item Name=\"ZoneDLNA1\">0</Item>\n" +
    "    <Item Name=\"ZoneName2\">Tivo &amp; Netflix</Item>\n" +
    "    <Item Name=\"ZoneID2\">10015</Item>\n" +
    "    <Item Name=\"ZoneGUID2\">{C65DCE15-B142-478C-B2A2-3B6F775F6BCA}</Item>\n" +
    "    <Item Name=\"ZoneDLNA2\">0</Item>\n" +
    "</Response>";

const failed =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"Failure\">\n" +
    "</Response>";
