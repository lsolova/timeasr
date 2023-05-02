import { CurrentTime } from "../current-time";
import { DatabaseConfiguration, DB_NAME, DB_STORE_BYTIME_INDEX, DB_STORE_SETTINGS, DB_STORE_TIMELOG } from "./types";
import { FinishedTimelog, Timelog, UUID } from "../../types";
import { IndexedDb } from "./indexed-db";
import { SETTING_ENTRY_KEY_NAME, TimelogEntry, TIMELOG_ENTRY_KEY_NAME, TIMELOG_ENTRY_TIME_NAME } from "../types";

export const DB_CONFIG: DatabaseConfiguration = {
    dbName: DB_NAME,
    dbVersion: 3,
    tables: [
        {
            tableName: DB_STORE_TIMELOG,
            keyPath: TIMELOG_ENTRY_KEY_NAME,
            autoIncrement: false,
            indices: [
                {
                    indexName: DB_STORE_BYTIME_INDEX,
                    indexPath: TIMELOG_ENTRY_TIME_NAME,
                    unique: true,
                },
            ],
        },
        {
            tableName: DB_STORE_SETTINGS,
            keyPath: SETTING_ENTRY_KEY_NAME,
            autoIncrement: false,
        },
    ],
};
type TimelogEntriesQueryFunctionParams = { fromEpoch?: number; toEpoch?: number; limit?: number };

/* EXPERIMENTAL CODE FRAGMENT -->
 * This is a test to check if an incremental parsing could be implemented or not.
 * It is needed if the log is too large. In that case an incremental parsing makes sense.
 */
function* timelogParserGenerator() {
    let lastEntry = null;
    let currentEntry: TimelogEntry | null;

    do {
        currentEntry = yield;
        if (currentEntry !== null && currentEntry.logType === "start") {
            const details: Timelog = {
                logId: currentEntry.logId,
                startTime: currentEntry.logTime,
                task: currentEntry.task,
                namespace: currentEntry.namespace ?? 'default',
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

const addTimelogQueryFn = (trx: IDBTransaction, timelogEntry: TimelogEntry): Promise<UUID> => {
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

const getTimelogsQueryFn = (
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
        const entryFeeder = timelogParserGenerator();
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
                entryFeeder.next(null); // EXPERIMENTAL CODE FRAGMENT
            }
        });
    });
    return timelogListPromise;
};

const initializeDB = () => {
    IndexedDb.init(DB_CONFIG);
};
const getTimelogEntries = async () => {
    return await IndexedDb.runQuery({
        data: { fromEpoch: 0, toEpoch: CurrentTime.get() },
        objectStore: DB_STORE_TIMELOG,
        writable: false,
        queryFunction: getTimelogsQueryFn,
    });
};
const persistTimelogEntry = (timelogEntry: TimelogEntry) => {
    return IndexedDb.runQuery<TimelogEntry, UUID>({
        data: timelogEntry,
        objectStore: DB_STORE_TIMELOG,
        writable: true,
        queryFunction: addTimelogQueryFn,
    });
};

export const IndexedDbBinding = {
    initializeDB,
    getTimelogEntries,
    persistTimelogEntry,
};
