import { dayStart } from "./time-conversions";
import { FIVE_MINUTES_IN_MILLIS, ONE_HOUR_IN_MILLIS, ONE_MINUTE_IN_MILLIS } from "../constants";
import { Milliseconds } from "../types";
import { now } from "./browser-wrapper";
import { parseEnteredTime } from "./utils";

let currentTimeOffset: Milliseconds = 0;
let lastUpdate = 0;
let watcher: (() => void) | null = null;

const notifyWatcher = () => {
    if (typeof watcher === "function") {
        watcher();
    }
};

const getCurrentTime = (): Milliseconds => {
    if (currentTimeOffset && lastUpdate + FIVE_MINUTES_IN_MILLIS < now()) {
        currentTimeOffset = 0;
        lastUpdate = 0;
    }
    return now() + currentTimeOffset;
};

const setCurrentTimeByString = (timeString: string | undefined): void => {
    const parsedTime = parseEnteredTime(timeString);
    if (parsedTime) {
        const { hours, minutes } = parsedTime;
        const currentDayStart = dayStart(getCurrentTime());
        const offset = new Date(currentDayStart).getTimezoneOffset();
        const preparedTime =
            currentDayStart +
            hours * ONE_HOUR_IN_MILLIS +
            minutes * ONE_MINUTE_IN_MILLIS +
            offset * ONE_MINUTE_IN_MILLIS;
        currentTimeOffset = preparedTime - now();
        if (preparedTime) {
            lastUpdate = now();
        }
    } else {
        currentTimeOffset = 0;
    }
    notifyWatcher();
};

export const CurrentTime = {
    get: getCurrentTime,
    isDifferent: () => currentTimeOffset !== 0,
    set: setCurrentTimeByString,
    watch: (eventListener: () => void) => {
        watcher = eventListener;
    },
};
