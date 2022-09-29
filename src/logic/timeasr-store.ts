import { addTimelogQueryFn, getTimelogsQueryFn } from "./timeasr-store-indexed-db-binding";
import { convertTimelogToTimelogEntry, parseTimelogEntriesToTimelogs } from "./timelog-store-utils";
import { DB_CONFIG, DB_STORE_TIMELOG, TimelogEntry } from "./types";
import { IndexedDb } from "./persistent-store/indexed-db";
import { FinishedTimelog, isTimelogFinished, StartedTimelog, Timelog, UUID } from "../types";
import { now, randomUUID } from "./browser-wrapper";

let timelogList: Timelog[] = [];
const watchers: (() => void)[] = [];

const isTimelogRunning = (timelog: Timelog | null) => timelog !== null && !isTimelogFinished(timelog);
const notifyWatchers = () => watchers.forEach((watcher) => watcher.call(null));
const watch = (watcher: () => void) => {
    watchers.push(watcher);
    watcher();
};
const getTimelogEntries = async () => {
    return await IndexedDb.runQuery({
        data: { fromEpoch: 0, toEpoch: now() },
        objectStore: DB_STORE_TIMELOG,
        writable: false,
        queryFunction: getTimelogsQueryFn,
    });
};
const initialize = async () => {
    IndexedDb.init(DB_CONFIG);
    const timelogEntries = await getTimelogEntries();
    timelogList = parseTimelogEntriesToTimelogs(timelogEntries);
    notifyWatchers();
};
const persistTimelogEntry = (timelogEntry: TimelogEntry) => {
    return IndexedDb.runQuery<TimelogEntry, UUID>({
        data: timelogEntry,
        objectStore: DB_STORE_TIMELOG,
        writable: true,
        queryFunction: addTimelogQueryFn,
    });
};
/** Return a set of timelogs if timelog period has an overlap with the requested period.
 */
const getTimelogsOfPeriod = (fromEpoch: number, toEpoch?: number): Timelog[] => {
    // If a period until now is checked, then toEpoch should be in the near future instead of the exact now time
    const usedToEpoch = toEpoch || now() + 2500;
    /* What should be checked? There are three cases:
     * - timelog started within the period
     * - timelog finished within the period
     * - timelog is running within the period
     */
    const isStartTimeWithinRequestedPeriod = (timelog) =>
        timelog.startTime >= fromEpoch && timelog.startTime <= usedToEpoch;
    const isTimelogRunningWithinRequestedPeriod = (timelog) =>
        !isTimelogFinished(timelog) && now() >= fromEpoch && now() <= usedToEpoch;
    const isEndTimeWithinRequestedPeriod = (timelog) =>
        isTimelogFinished(timelog) && timelog.endTime >= fromEpoch && timelog.endTime <= usedToEpoch;
    return timelogList.filter(
        (timelog) =>
            isStartTimeWithinRequestedPeriod(timelog) ||
            isEndTimeWithinRequestedPeriod(timelog) ||
            isTimelogRunningWithinRequestedPeriod(timelog)
    );
};
const getLastTimelog = (): Timelog | null => {
    return timelogList.length ? timelogList[0] : null;
};
const closeTimelog = async (): Promise<Timelog> => {
    const lastTimelog = getLastTimelog();
    if (isTimelogRunning(lastTimelog)) {
        const newTimelog = {
            ...lastTimelog,
            closingLogId: randomUUID(),
            endTime: now() - 1, // Due to time uniqueness in the underlying DB
        } as FinishedTimelog;
        await persistTimelogEntry(convertTimelogToTimelogEntry(newTimelog, "end"));
        timelogList.shift();
        timelogList.unshift(newTimelog);
        notifyWatchers();
    }
    return lastTimelog;
};
const startTimelog = async (task?: string): Promise<Timelog> => {
    const lastTimelog = getLastTimelog();
    if (isTimelogRunning(lastTimelog)) {
        closeTimelog();
    }
    const newTimelog = {
        logId: randomUUID(),
        startTime: now(),
        task,
    } as StartedTimelog;
    await persistTimelogEntry(convertTimelogToTimelogEntry(newTimelog, "start"));
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
