import { dayStart } from "./time-conversions";
import { FIVE_MINUTES_IN_MILLIS, ONE_HOUR_IN_MILLIS, ONE_MINUTE_IN_MILLIS } from "../constants";
import { isNewerThanLastEntry, parseEnteredTime } from "./utils";
import { Milliseconds } from "../types";
import { now } from "./browser-wrapper";
import { TimeasrStore } from "./timeasr-store";

let currentTimeOffset: Milliseconds = 0;
let lastUpdate = 0;
let _eventListener: (() => void) | null = null;

const notifyWatcher = () => {
    if (typeof _eventListener === "function") {
        _eventListener();
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
        // Change only if it is newer than the last log entry
        if (isNewerThanLastEntry(preparedTime, TimeasrStore.getLastTimelog())) {
            currentTimeOffset = preparedTime - now();
            lastUpdate = now();
        } else {
            throw new Error("Time cannot be set, it is earlier than last log.");
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
    addEventListener: (eventListener: () => void) => {
        _eventListener = eventListener;
    },
};
