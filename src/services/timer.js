/** Provides polling capability to arbitrary functions. */
class TimerService {
    pollers = [];

    isPolling = id => this.getPollerIdx(id) > -1;

    getPollerIdx = id => this.pollers.findIndex(p => p.id === id);

    startPolling = (eventId, callback, intervalMillis) => {
        if (this.isPolling(eventId)) {
            console.log(`Unable to start poller ${eventId}, already polling`);
        } else {
            const data = {id: eventId, intervalId: -1, times: []};
            data.intervalId = setInterval(this.loggingPoller(data, callback), intervalMillis);
            this.pollers.push(data);
        }
    };

    loggingPoller = (data, callback) => () => {
        while (data.times.length >= 6) {
            data.times.pop();
        }
        data.times.unshift(new Date());
        callback();
    };

    stopPolling = (id) => {
        const idx = this.getPollerIdx(id);
        if (idx > -1) {
            clearInterval(this.pollers[idx].intervalId);
            this.pollers.splice(idx, 1);
            return true;
        }
        return false;
    };

    stopAll = () => {
        this.pollers.forEach(p => clearInterval(p.intervalId));
    };

    stopAllMatching = (prefix) => {
        const remove = this.pollers.filter(p => p.id.startsWith(prefix));
        remove.forEach(r => clearInterval(r.intervalId));
        this.pollers = this.pollers.filter(p => !p.id.startsWith(prefix));
    };

    getPollerData = () => this.pollers.map(p => {
        return {id: p.id, times: p.times};
    });
}

export const provideTimerService = () => new TimerService();
const timerService = provideTimerService();
export default timerService;
