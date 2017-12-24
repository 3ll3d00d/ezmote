import * as fields from "../store/config/config";

const API_PREFIX = 'api/1';

/**
 * Encapsulates any calls to the cmdserver.
 */
class CmdServerService {

    getRootURL = (config) => `http://${config[fields.MC_HOST]}:${config[fields.CMDSERVER_PORT]}`;

    /**
     * Gets all available commands
     */
    getCommands = async (config) => {
        const rootURL = this.getRootURL(config);
        const response = await fetch(`${rootURL}/${API_PREFIX}/commands`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`CmdServer.getCommands failed, HTTP status ${response.status}`);
        }
        const json = await response.json();
        const commands = json['commands'];
        return Object.keys(commands)
                     .map(c => Object.assign(commands[c], {id: c, icon: `${rootURL}/icons/${commands[c].icon}`}));
    };

    /**
     * Sends the command to the service.
     * @param config
     * @param commandId
     * @returns {Promise<void>}
     */
    sendCommand = async (config, commandId) => {
        const rootURL = this.getRootURL(config);
        const response = await fetch(`${rootURL}/${API_PREFIX}/commands/${commandId}`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error(`CmdServer.sendCommand failed, HTTP status ${response.status}`);
        }
        return await response.json();
    }
}

export default new CmdServerService();
