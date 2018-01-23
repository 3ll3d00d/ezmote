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

    describe('alive', () => {
        it('should report server details', async () => {
            fetch.mockResponseOnce(alive);
            const before = new Date().getTime();
            const response = await jriver.invoke(mcws.alive(goodConfig));
            const after = new Date().getTime();
            expect(response).toMatchObject({
                serverName: 'hello',
                version: '23.0.92',
            });
            expect(response).toHaveProperty('pingTime');
            expect(response.pingTime).toBeLessThanOrEqual(after);
            expect(response.pingTime).toBeGreaterThanOrEqual(before);
        });

        it('should handle Failure response', async () => {
            fetch.mockResponseOnce(failed);
            let error;
            try {
                await jriver.invoke(mcws.alive(goodConfig));
            } catch (e) {
                error = e;
            }
            expect(error.message).toMatch(/^Bad response .*/);
        });

        it('should handle http errors', async () => {
            fetch.mockResponseOnce('', {status: 500});
            let error;
            try {
                await jriver.invoke(mcws.alive(goodConfig));
            } catch (e) {
                error = e;
            }
            expect(error).toEqual(new Error('JRiverService.ALIVE failed, HTTP status 500'));
        });
    });
});

const failed =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"Failure\">\n" +
    "</Response>";

const alive =
    "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\" ?>\n" +
    "<Response Status=\"OK\">\n" +
    "<Item Name=\"RuntimeGUID\">{0D30BB98-DC8B-4D82-8CF4-58111FE84739}</Item>\n" +
    "<Item Name=\"LibraryVersion\">24</Item>\n" +
    "<Item Name=\"ProgramName\">JRiver Media Center</Item>\n" +
    "<Item Name=\"ProgramVersion\">23.0.92</Item>\n" +
    "<Item Name=\"FriendlyName\">hello</Item>\n" +
    "<Item Name=\"AccessKey\">abcdef</Item>\n" +
    "<Item Name=\"ProductVersion\">23 Windows</Item>\n" +
    "</Response>";
