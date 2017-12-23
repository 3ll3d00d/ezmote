import jriver from '../jriver';

global.fetch = require('jest-fetch-mock');

describe('services/jriver', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    describe('getAllZones', () => {

        it('should get data', async () => {
            fetch.mockResponseOnce(manyZones);
            const response = await jriver.getZones('me', 'you');
            expect(response).toEqual([
                {id: '10002', name: 'Music', active: false},
                {id: '10009', name: 'Films', active: true},
                {id: '10015', name: 'Tivo & Netflix', active: false},
            ]);
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            const response = await jriver.getZones('me', 'you');
            expect(response).toEqual([]);
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.getZones('me', 'you');
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.GET_ZONES failed, HTTP status 500'));
        });
    });

    describe('getZoneInfo', () => {
        it('should get data', async () => {
            fetch.mockResponseOnce(zoneInfo);
            const response = await jriver.getZoneInfo('me', 'you', '10015');
            expect(response).toEqual({
                    id: '10015',
                    name: 'Tivo & Netflix',
                    volumeRatio: 0.38,
                    volumedb: -31,
                    fileKey: '723010',
                    imageURL: 'MCWS/v1/File/GetImage?File=723010'
                },
            );
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            const response = await jriver.getZoneInfo('who', 'me', 'you');
            expect(response).toEqual({});
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.getZoneInfo('who', 'me', 'you');
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.GET_ZONE_INFO failed, HTTP status 500'));
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

const zoneInfo =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"OK\">\n" +
    "    <Item Name=\"ZoneID\">10015</Item>\n" +
    "    <Item Name=\"ZoneName\">Tivo &amp; Netflix</Item>\n" +
    "    <Item Name=\"State\">0</Item>\n" +
    "    <Item Name=\"FileKey\">723010</Item>\n" +
    "    <Item Name=\"NextFileKey\">-1</Item>\n" +
    "    <Item Name=\"PositionMS\">0</Item>\n" +
    "    <Item Name=\"DurationMS\">0</Item>\n" +
    "    <Item Name=\"ElapsedTimeDisplay\">0:00</Item>\n" +
    "    <Item Name=\"RemainingTimeDisplay\">Live</Item>\n" +
    "    <Item Name=\"TotalTimeDisplay\">Live</Item>\n" +
    "    <Item Name=\"PositionDisplay\">0:00 / Live</Item>\n" +
    "    <Item Name=\"PlayingNowPosition\">0</Item>\n" +
    "    <Item Name=\"PlayingNowTracks\">1</Item>\n" +
    "    <Item Name=\"PlayingNowPositionDisplay\">1 of 1</Item>\n" +
    "    <Item Name=\"PlayingNowChangeCounter\">22</Item>\n" +
    "    <Item Name=\"Bitrate\">0</Item>\n" +
    "    <Item Name=\"Bitdepth\">0</Item>\n" +
    "    <Item Name=\"SampleRate\">0</Item>\n" +
    "    <Item Name=\"Channels\">0</Item>\n" +
    "    <Item Name=\"Chapter\">0</Item>\n" +
    "    <Item Name=\"Volume\">0.38</Item>\n" +
    "    <Item Name=\"VolumeDisplay\">38%  (-31.0 dB)</Item>\n" +
    "    <Item Name=\"ImageURL\">MCWS/v1/File/GetImage?File=723010</Item>\n" +
    "    <Item Name=\"Name\">Ipc</Item>\n" +
    "    <Item Name=\"Status\">Stopped</Item>\n" +
    "</Response>";