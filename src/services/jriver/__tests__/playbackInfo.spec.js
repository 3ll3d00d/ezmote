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

    describe('playbackInfo', () => {
        it('should get data', async () => {
            fetch.mockResponseOnce(zoneInfo);
            const response = await jriver.invoke(mcws.playbackInfo(goodConfig, '10015'));
            expect(response).toEqual({
                    active: true,
                    id: '10015',
                    name: 'Tivo & Netflix',
                    volumeRatio: 0.38,
                    volumedb: -31,
                    muted: false,
                    playingNow: {
                        status: 'Stopped',
                        album: null,
                        artist: null,
                        durationMillis: 0,
                        externalSource: true,
                        fileKey: '723010',
                        imageURL: 'MCWS/v1/File/GetImage?File=723010',
                        name: 'Ipc',
                        positionDisplay: '1 of 1',
                        positionMillis: 0
                    }
                },
            );
        });

        it('should handle data with no name', async () => {
            fetch.mockResponseOnce(zoneInfoWithNoName);
            const response = await jriver.invoke(mcws.playbackInfo(goodConfig, '10015'));
            expect(response).toEqual({
                    active: true,
                    id: '10015',
                    volumeRatio: 0.38,
                    volumedb: -31,
                    muted: false,
                    playingNow: {
                        status: 'Stopped',
                        album: null,
                        artist: null,
                        durationMillis: 0,
                        externalSource: true,
                        fileKey: '723010',
                        imageURL: 'MCWS/v1/File/GetImage?File=723010',
                        name: 'Ipc',
                        positionDisplay: '1 of 1',
                        positionMillis: 0
                    }
                },
            );
        });

        it('should handle data with muted volume', async () => {
            fetch.mockResponseOnce(zoneInfoWithMutedVolume);
            const response = await jriver.invoke(mcws.playbackInfo(goodConfig, '10015'));
            expect(response).toEqual({
                    active: true,
                    id: '10015',
                    name: 'Tivo & Netflix',
                    volumeRatio: 0.38,
                    volumedb: -100,
                    muted: true,
                    playingNow: {
                        status: 'Stopped',
                        album: null,
                        artist: null,
                        durationMillis: 0,
                        externalSource: true,
                        fileKey: '723010',
                        imageURL: 'MCWS/v1/File/GetImage?File=723010',
                        name: 'Ipc',
                        positionDisplay: '1 of 1',
                        positionMillis: 0
                    }
                }
            );
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            let error;
            try {
                await jriver.invoke(mcws.playbackInfo(goodConfig, 'you'));
            } catch (e) {
                error = e;
            }
            expect(error.message).toMatch(/^Bad response .*/);
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.invoke(mcws.playbackInfo(goodConfig, 'you'));
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.GET_ZONE_INFO failed, HTTP status 500'));
        });

    });

});

const failed =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"Failure\">\n" +
    "</Response>";

const zoneName = "    <Item Name=\"ZoneName\">Tivo &amp; Netflix</Item>\n";

const makeZoneInfoData = (zoneNameLine, volumeDisplay) => {
    return "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
        "<Response Status=\"OK\">\n" +
        "    <Item Name=\"ZoneID\">10015</Item>\n" +
        zoneNameLine +
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
        "    <Item Name=\"VolumeDisplay\">" + volumeDisplay + "</Item>\n" +
        "    <Item Name=\"ImageURL\">MCWS/v1/File/GetImage?File=723010</Item>\n" +
        "    <Item Name=\"Name\">Ipc</Item>\n" +
        "    <Item Name=\"Status\">Stopped</Item>\n" +
        "</Response>";
};
const zoneInfo = makeZoneInfoData(zoneName, "38%  (-31.0 dB)");
const zoneInfoWithNoName = makeZoneInfoData("", "38%  (-31.0 dB)");
const zoneInfoWithMutedVolume = makeZoneInfoData(zoneName, "Muted");
