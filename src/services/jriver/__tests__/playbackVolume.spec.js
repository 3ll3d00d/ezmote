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

    describe('playbackVolume', () => {
        it('should set volume', async () => {
            fetch.mockResponseOnce(volumeSet);
            const response = await jriver.invoke(mcws.playbackVolume(goodConfig, '10015', 0.5));
            expect(response).toEqual(0.5);
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            let error;
            try {
                await jriver.invoke(mcws.playbackVolume(goodConfig, '10015', 0.5));
            } catch (e) {
                error = e;
            }
            expect(error.message).toMatch(/^Bad response .*/);
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.invoke(mcws.playbackVolume(goodConfig, '10015', 0.5));
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.SET_VOLUME failed, HTTP status 500'));
        });
    });
});

const failed =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"Failure\">\n" +
    "</Response>";

const volumeSet =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"OK\">\n" +
    "    <Item Name=\"Level\">0.5</Item>\n" +
    "    <Item Name=\"Display\">50%  (-25.0 dB)</Item>\n" +
    "</Response>";
