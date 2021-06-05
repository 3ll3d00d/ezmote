const converter = (json) => {
    if (json.Response._attributes.Status === 'OK') {
        const zones = new Map();
        let activeZoneId;
        // iterate over the items rather than search for zones one by one (to avoid repeatedly searching a map)
        json.Response.Item.forEach(item => {
            const itemName = item._attributes.Name;
            let itemIdx;
            let zone = {};
            if (itemName.startsWith('ZoneName')) {
                itemIdx = itemName.substr(8);
                zone = Object.assign(zone, {name: item._text});
            } else if (itemName.startsWith('ZoneID')) {
                itemIdx = itemName.substr(6);
                zone = Object.assign(zone, {id: item._text});
            } else if (itemName === 'CurrentZoneID') {
                activeZoneId = item._text;
            }
            if (itemIdx) {
                let storedZone = zones.get(itemIdx);
                if (storedZone) {
                    storedZone = Object.assign(storedZone, zone);
                } else {
                    storedZone = zone;
                }
                zones.set(itemIdx, storedZone);
            }
        });
        return Array.from(zones.values())
                    .map(z => Object.assign(z, {active: (activeZoneId && z.id === activeZoneId)}));
    } else {
        throw new Error(`Bad response ${JSON.stringify(json)}`)
    }
};

const endpoint = {
    name: 'GET_ZONES',
    path: 'MCWS/v1/Playback/Zones',
    requiredParams: [],
    converter
};

export default serverURL => Object.assign({}, {serverURL}, endpoint);