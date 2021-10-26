import { TimelogEntry } from "../interfaces";
import { now } from "./browser-wrapper";
import { init, runQuery } from "./persistent-store-indexed-db";

const DB_STORE_TIMELOG = 'timelog';
const DB_STORE_BYTIME_INDEX = 'byTimeIndex';
const DB_CONFIG = {
    dbName: 'TimeasrDB',
    dbVersion: 2,
    tables: [
        {
            tableName: DB_STORE_TIMELOG,
            keyPath: 'tlid',
            autoIncrement: false,
            indexes: [
                {
                    indexName: DB_STORE_BYTIME_INDEX,
                    indexPath: 'startTime',
                    unique: true
                }
            ]
        }
    ]
};
const convertDayCountToDay = (dayCount: number): number => now() + (dayCount * 86400000);
let timelogList: TimelogEntry[];

function getTimelogsQueryFn(trx: IDBTransaction, { fromEpoch = 0, toEpoch = 0, limit = Infinity }: { fromEpoch?: number, toEpoch?: number, limit?: number }): Promise<TimelogEntry[]> {
    const timelogListPromise = new Promise<TimelogEntry[]>((resolve, reject) => {
        const trxStore = trx.objectStore(DB_STORE_TIMELOG);
        const byTimeIndex = trxStore.index(DB_STORE_BYTIME_INDEX);
        const range = (toEpoch > fromEpoch)
            ? IDBKeyRange.bound(fromEpoch, toEpoch)
            : IDBKeyRange.lowerBound(fromEpoch);
        const cursorRequest = byTimeIndex.openCursor(range, 'next');

        const receivedTimeLogList = [];
        cursorRequest.onerror = (error) => {
            reject(error);
        };
        cursorRequest.onsuccess = (evt) => {
            const cursor = cursorRequest.result;
            if (receivedTimeLogList.length < limit && cursor) {
                receivedTimeLogList.push(cursor.value);
                cursor.continue();
            } else {
                resolve(receivedTimeLogList);
            }
        };
    });
    return timelogListPromise;
}

function addTimelogQueryFn(trx: IDBTransaction, timelogEntry: TimelogEntry) {
    const addingResult = new Promise((resolve) => {
        const timelogStore = trx.objectStore(DB_STORE_TIMELOG);
        const request = timelogStore.put(timelogEntry);

        request.onsuccess = () => {
            resolve(request.result);
        }
    });
    return addingResult;
}

let initializedStore;

function initDB() {
    if (!initializedStore) {
        initializedStore = init(DB_CONFIG);
    }
}

export function getTimelogsOfPeriod(fromEpoch: number, toEpoch?: number): Promise<TimelogEntry[]> {
    initDB();
    toEpoch = toEpoch ?? now();
    return runQuery<{ fromEpoch?: number, toEpoch?: number }, TimelogEntry[]>({
        data: { fromEpoch, toEpoch },
        objectStore: DB_STORE_TIMELOG,
        writable: false,
        queryFunction: getTimelogsQueryFn
    });
}

export function getLastTimelog(): Promise<TimelogEntry | null> {
    initDB();
    const fromEpoch = convertDayCountToDay(-100);
    const toEpoch = now();
    return runQuery<{ fromEpoch?: number, toEpoch?: number, limit?: number }, TimelogEntry[]>({
        data: { fromEpoch, toEpoch, limit: 1 },
        objectStore: DB_STORE_TIMELOG,
        writable: false,
        queryFunction: getTimelogsQueryFn
    }).then((timelogList) => {
        return (timelogList.length) ? timelogList[0] : null;
    });
}

export function saveTimelog(timelog: TimelogEntry): Promise<TimelogEntry> {
    initDB();
    return runQuery({
            data: timelog,
            objectStore: DB_STORE_TIMELOG,
            writable: true,
            queryFunction: addTimelogQueryFn
        })
        .then(() => {
            if (timelogList) {
                timelogList.push(timelog);
            }
            return timelog;
    });
}
