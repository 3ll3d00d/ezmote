/**
 * Provides polling capability to arbitrary functions.
 */
class TimerService {
    pollers = [];

    isPolling = (matcher) => this.getPollerIdx(matcher) > -1;

    getPollerIdx = (matcher) => this.pollers.findIndex(matcher);

    startPolling = (eventId, callback, intervalMillis) => {
        const intervalId = setInterval(callback, intervalMillis);
        this.pollers.push({id: eventId, intervalId});
    };

    stopPolling = (matcher) => {
        const idx = this.getPollerIdx(matcher);
        if (idx > -1) {
            clearInterval(this.pollers[idx].intervalId);
            this.pollers.splice(idx, 1);
            return true;
        }
        return false;
    };
}

export const provideTimerService = () => new TimerService();

export default provideTimerService();
