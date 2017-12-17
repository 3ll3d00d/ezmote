const JRIVER_URL = 'http://paradroid:63412/MCWS/v1';
const ENDPOINTS = {
    'GET_ZONES': 'Playback/Zones'
};

/**
 * Encapsulates any calls to MCWS.
 */
class JRiverService {
    getUrl = (target) => {
        if (Object.hasOwnProperty(target)) {
            return `${JRIVER_URL}/${ENDPOINTS[target]}`;
        }
        throw `Unknown target - ${target}`;
    };

    /**
     * Gets zone information.
     * @returns {Promise<void>}
     */
    async getZones() {
        const url = this.getUrl('GET_ZONES');
        const response = await fetch(url, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`JRiverService.getZones failed, HTTP status ${response.status}`);
        }
        const data = await response.body();
        return data;
    }
}

export default new JRiverService();
