const TICKER_EVENT_NAME = "timeasrTick";
const FIVE_MINUTES_IN_MILLIS = 300000;

export const initializeTimeasrTick = () => {
    let tickInterval: ReturnType<typeof setInterval> | null = null;
    const sendTick = () => document.dispatchEvent(new CustomEvent(TICKER_EVENT_NAME));
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") {
            sendTick();
            tickInterval = setInterval(() => sendTick(), FIVE_MINUTES_IN_MILLIS);
        } else {
            if (tickInterval !== null) {
                clearInterval(tickInterval);
            }
        }
    });
};

export const addTimeasrTickListener = (listener: EventListener) => {
    document.addEventListener(TICKER_EVENT_NAME, listener);
};
