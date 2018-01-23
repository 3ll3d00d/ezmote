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

    describe('authenticate', () => {
        it('should provide token', async () => {
            fetch.mockResponseOnce(auth);
            const before = new Date().getTime();
            const response = await jriver.invoke(mcws.authenticate(goodConfig));
            const after = new Date().getTime();
            expect(response).toHaveProperty('token');
            expect(response.token).toBe('abcdef');
            expect(response).toHaveProperty('time');
            expect(response.time).toBeLessThanOrEqual(after);
            expect(response.time).toBeGreaterThanOrEqual(before);
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            let error;
            try {
                await jriver.invoke(mcws.authenticate(goodConfig));
            } catch (e) {
                error = e;
            }
            expect(error.message).toMatch(/^Bad response .*/);
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.invoke(mcws.authenticate(goodConfig));
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.AUTH failed, HTTP status 500'));
        });
    });
});

const failed =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"Failure\">\n" +
    "</Response>";

const auth =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"OK\">\n" +
    "<Item Name=\"Token\">abcdef</Item>\n" +
    "</Response>";
