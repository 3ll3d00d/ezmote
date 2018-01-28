const API_PREFIX = '/api/1';

/**
 * Encapsulates any calls to the cmdserver.
 */
class CmdServerService {

    /** Gets all available commands */
    getCommands = async () => {
        const response = await fetch(`${API_PREFIX}/commands`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`CmdServer.getCommands failed, HTTP status ${response.status}`);
        }
        const json = await response.json();
        const commands = json['commands'];
        return Object.keys(commands)
                     .map(c => Object.assign(commands[c], {id: c, icon: `/icons/${commands[c].icon}`}));
    };

    /** Gets whatever is playing now */
    getPlayingNow = async () => {
        const response = await fetch(`${API_PREFIX}/playingnow`, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`CmdServer.getPlayingNow failed, HTTP status ${response.status}`);
        }
        return await response.json();
    };

    /**
     * Sends the command to the service.
     * @param commandId
     * @returns {Promise<void>}
     */
    sendCommand = async (commandId) => {
        const response = await fetch(`${API_PREFIX}/commands/${commandId}`, {
            method: 'PUT'
        });
        if (!response.ok) {
            throw new Error(`CmdServer.sendCommand failed, HTTP status ${response.status}`);
        }
        return await response.json();
    };

    /**
     * Sends keypresses to the tivo bridge.
     * @param tivoName the tivo name.
     * @param type the command type.
     * @param command the command.
     * @returns {Promise<any>}
     */
    sendTivoCommand = async (tivoName, type, command) => {
        const response = await fetch(`${API_PREFIX}/tivos`, {
            method: 'PUT',
            body: JSON.stringify({
                name: tivoName,
                type,
                command
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });
        if (!response.ok) {
            throw new Error(`CmdServer.sendTivoCommand failed, HTTP status ${response.status}`);
        }
        return await response.json();
    };
}

export default new CmdServerService();
