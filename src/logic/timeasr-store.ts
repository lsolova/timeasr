import {
    convertTimelogToTimelogEntry,
    isTimelogWithinPeriod,
    parseTimelogEntriesToTimelogs,
} from "./timelog-store-utils";
import { FinishedTimelog, isTimelogFinished, StartedTimelog, Timelog } from "../types";
import { now, randomUUID } from "./browser-wrapper";
import { parseToTaskAndNamespace } from "./model-parsers";
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
    const usedToEpoch = toEpoch || now() + 2500;
    return timelogList.filter((timelog) => isTimelogWithinPeriod(timelog, fromEpoch, usedToEpoch));
};
const getLastTimelog = (): Timelog | null => {
    return timelogList.length ? timelogList[0] : null;
};
const closeTimelog = async (): Promise<Timelog | null> => {
    const lastTimelog = getLastTimelog();
    if (isTimelogRunning(lastTimelog)) {
        const newTimelog = {
            ...lastTimelog,
            closingLogId: randomUUID(),
            endTime: now() - 1, // Due to time uniqueness in the underlying DB
        } as FinishedTimelog;
        await binding.persistTimelogEntry(convertTimelogToTimelogEntry(newTimelog, "end"));
        timelogList.shift();
        timelogList.unshift(newTimelog);
        notifyWatchers();
    }
    return lastTimelog;
};
const startTimelog = async (task?: string): Promise<Timelog> => {
    const { namespace, taskName } = parseToTaskAndNamespace(task);
    const lastTimelog = getLastTimelog();
    if (isTimelogRunning(lastTimelog)) {
        closeTimelog();
    }
    const newTimelog = {
        logId: randomUUID(),
        startTime: now(),
        task: taskName,
        namespace: namespace,
    } as StartedTimelog;
    await binding.persistTimelogEntry(convertTimelogToTimelogEntry(newTimelog, "start"));
    timelogList.unshift(newTimelog);
    notifyWatchers();
    return newTimelog;
};

export const TimeasrStore = {
    closeTimelog,
    getLastTimelog,
    getTimelogsOfPeriod,
    initialize,
    startTimelog,
    watch,
};
