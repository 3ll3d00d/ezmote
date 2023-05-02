import jriver from '../index';
import * as configTypes from '../../../store/config/config';
import * as mcws from '../mcws';
import { describe, it, expect } from 'vitest';

describe('services/jriver', () => {

    const goodConfig = {
        [configTypes.MC_USE_SSL]: false,
        [configTypes.MC_HOST]: 'mchost',
        [configTypes.MC_PORT]: 52199,
        [configTypes.MC_USERNAME]: 'mcusername',
        [configTypes.MC_PASSWORD]: 'mcpassword'
    };

    describe('playbackMute', () => {
        it('should mute', async () => {
            fetch.mockResponseOnce(muteSet);
            const response = await jriver.invoke(mcws.playbackMute(goodConfig, '10015', true));
            expect(response).toEqual(true);
        });

        it('should unmute', async () => {
            fetch.mockResponseOnce(muteUnset);
            const response = await jriver.invoke(mcws.playbackMute(goodConfig, '10015', false));
            expect(response).toEqual(false);
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            let error;
            try {
                await jriver.invoke(mcws.playbackMute(goodConfig, '10015', true));
            } catch (e) {
                error = e;
            }
            expect(error.message).toMatch(/^Bad response .*/);
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.invoke(mcws.playbackMute(goodConfig, '10015', true));
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.MUTE failed, HTTP status 500'));
        });
    });
});

const failed =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"Failure\">\n" +
    "</Response>";

const muteSet =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"OK\">\n" +
    "    <Item Name=\"State\">1</Item>\n" +
    "</Response>";
const muteUnset =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"OK\">\n" +
    "    <Item Name=\"State\">0</Item>\n" +
    "</Response>";
