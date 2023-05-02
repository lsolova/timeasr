import { FIVE_MINUTES_IN_MILLIS } from "../constants";

const TICKER_EVENT_NAME = "timeasrTick";

export const initializeTimeasrTick = () => {
    let tickInterval: ReturnType<typeof setInterval> | null = null;
    const sendTick = () => document.dispatchEvent(new CustomEvent(TICKER_EVENT_NAME));
    const eventListener = () => {
        if (document.visibilityState === "visible") {
            sendTick();
            tickInterval = setInterval(() => sendTick(), FIVE_MINUTES_IN_MILLIS);
        } else {
            if (tickInterval !== null) {
                clearInterval(tickInterval);
            }
        }
    };
    document.addEventListener("visibilitychange", eventListener);
    eventListener();
};

export const addTimeasrTickListener = (listener: EventListener) => {
    document.addEventListener(TICKER_EVENT_NAME, listener);
};
