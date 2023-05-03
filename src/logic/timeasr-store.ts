import {
    convertTimelogToTimelogEntry,
    isTimelogWithinPeriod,
    parseTimelogEntriesToTimelogs,
} from "./timelog-store-utils";
import { CurrentTime } from "./current-time";
import { ERROR_CODE_TIME_CONFLICT } from "../constants";
import { FinishedTimelog, isTimelogFinished, StartedTimelog, Timelog } from "../types";
import { isNewerThanLastEntry } from "./utils";
import { parseToTaskAndNamespace } from "./model-parsers";
import { randomUUID } from "./browser-wrapper";
import { TimeasrStoreBinding } from "./types";

let binding: TimeasrStoreBinding = {} as TimeasrStoreBinding;
let timelogList: Timelog[] = [];
const watchers: (() => void)[] = [];

const isTimelogRunning = (timelog: Timelog | null) => timelog !== null && !isTimelogFinished(timelog);
const notifyWatchers = () => watchers.forEach((watcher) => watcher.call(null));
const watch = (watcher: () => void) => {
    watchers.push(watcher);
    watcher();
};

const initialize = async (storeBinding: TimeasrStoreBinding) => {
    binding = storeBinding;
    await binding.initializeDB();
    const timelogEntries = await binding.getTimelogEntries();
    timelogList = parseTimelogEntriesToTimelogs(timelogEntries);
    notifyWatchers();
};

/** Return a set of timelogs if timelog's period has an overlap with the requested period. */
const getTimelogsOfPeriod = (fromEpoch: number, toEpoch?: number): Timelog[] => {
    // If a period until now is checked, then toEpoch should be in the near future instead of the exact now time
    const usedToEpoch = toEpoch || CurrentTime.get() + 2500;
    return timelogList.filter((timelog) => isTimelogWithinPeriod(timelog, fromEpoch, usedToEpoch));
};
const getLastTimelog = (): Timelog | null => {
    return timelogList.length ? timelogList[0] : null;
};
const closeTimelog = async (): Promise<Timelog | null> => {
    const lastTimelog = getLastTimelog();
    if (isTimelogRunning(lastTimelog)) {
        const expectedEndTime = CurrentTime.get() - 1; // Due to time uniqueness in the underlying DB
        if (isNewerThanLastEntry(expectedEndTime, lastTimelog)) {
            const newTimelog = {
                ...lastTimelog,
                closingLogId: randomUUID(),
                endTime: expectedEndTime,
            } as FinishedTimelog;
            await binding.persistTimelogEntry(convertTimelogToTimelogEntry(newTimelog, "end"));
            timelogList.shift();
            timelogList.unshift(newTimelog);
            notifyWatchers();
        } else {
            throw new Error(ERROR_CODE_TIME_CONFLICT);
        }
    }
    return lastTimelog;
};
const startTimelog = async (task?: string): Promise<Timelog> => {
    const { namespace, taskName } = parseToTaskAndNamespace(task);
    const lastTimelog = getLastTimelog();
    if (isTimelogRunning(lastTimelog)) {
        closeTimelog();
    }
    const expectedStartTime = CurrentTime.get();
    if (isNewerThanLastEntry(expectedStartTime, lastTimelog)) {
        const newTimelog = {
            logId: randomUUID(),
            startTime: expectedStartTime,
            task: taskName,
            namespace: namespace,
        } as StartedTimelog;
        await binding.persistTimelogEntry(convertTimelogToTimelogEntry(newTimelog, "start"));
        timelogList.unshift(newTimelog);
        notifyWatchers();
        return newTimelog;
    }
    throw new Error(ERROR_CODE_TIME_CONFLICT);
};

export const TimeasrStore = {
    closeTimelog,
    getLastTimelog,
    getTimelogsOfPeriod,
    initialize,
    startTimelog,
    watch,
};
