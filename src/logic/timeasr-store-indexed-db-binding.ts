import { DB_STORE_BYTIME_INDEX, DB_STORE_TIMELOG, TimelogEntry } from "./types";
import { FinishedTimelog, Timelog, UUID } from "../types";

type TimelogEntriesQueryFunctionParams = { fromEpoch?: number; toEpoch?: number; limit?: number };

/* EXPERIMENTAL CODE FRAGMENT -->
 * This is a test to check if an incremental parsing could be implemented or not.
 * It is needed if the log is too large. In that case an incremental parsing makes sense.
 */
function* timelogParserGenerator() {
    let lastEntry = null;
    let currentEntry: TimelogEntry;

    do {
        currentEntry = yield;
        if (currentEntry !== null && currentEntry.logType === "start") {
            const details: Timelog = {
                logId: currentEntry.logId,
                startTime: currentEntry.logTime,
                task: currentEntry.task,
            };
            if (lastEntry) {
                (details as FinishedTimelog).endTime = lastEntry.logTime;
                (details as FinishedTimelog).closingLogId = lastEntry.logId;
            }
            const evt = new CustomEvent("timelog:entry", {
                detail: details,
            });
            dispatchEvent(evt);
        }
        lastEntry = currentEntry;
    } while (currentEntry !== null);
}
// <-- EXPERIMENTAL CODE FRAGMENT

export const addTimelogQueryFn = (trx: IDBTransaction, timelogEntry: TimelogEntry): Promise<UUID> => {
    const addingResult = new Promise<UUID>((resolve, reject) => {
        const timelogStore = trx.objectStore(DB_STORE_TIMELOG);
        const request = timelogStore.put(timelogEntry);

        request.addEventListener("error", (error) => {
            reject(error);
        });
        request.addEventListener("success", () => {
            resolve(request.result.toString());
        });
    });
    return addingResult;
};

export const getTimelogsQueryFn = (
    trx: IDBTransaction,
    { fromEpoch = 0, toEpoch = 0, limit = Infinity }: TimelogEntriesQueryFunctionParams
): Promise<TimelogEntry[]> => {
    const timelogListPromise = new Promise<TimelogEntry[]>((resolve, reject) => {
        const trxStore = trx.objectStore(DB_STORE_TIMELOG);
        const byTimeIndex = trxStore.index(DB_STORE_BYTIME_INDEX);
        const range = toEpoch > fromEpoch ? IDBKeyRange.bound(fromEpoch, toEpoch) : IDBKeyRange.lowerBound(fromEpoch);
        const cursorRequest = byTimeIndex.openCursor(range, "prev");

        const receivedTimeLogList: TimelogEntry[] = [];
        cursorRequest.addEventListener("error", (error) => {
            reject(error);
        });
        // EXPERIMENTAL CODE FRAGMENT -->
        const entryFeeder: Generator<undefined, void, TimelogEntry | null> = timelogParserGenerator();
        entryFeeder.next();
        // <-- EXPERIMENTAL CODE FRAGMENT
        cursorRequest.addEventListener("success", () => {
            const cursor = cursorRequest.result;
            if (receivedTimeLogList.length < limit && cursor) {
                receivedTimeLogList.push(cursor.value);
                entryFeeder.next(cursor.value); // EXPERIMENTAL CODE FRAGMENT
                cursor.continue();
            } else {
                resolve(receivedTimeLogList);
                entryFeeder.next(null);
            }
        });
    });
    return timelogListPromise;
};
