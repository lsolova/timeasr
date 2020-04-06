import * as PersistentStore from './persistentStore';
import { v4 as uuidv4 } from 'uuid';

const DB_STORE_TIMELOG = 'timelog';
const DB_STORE_BYTIME_INDEX = 'byTimeIndex';
const LOGTYPE_START = 'STRT';
const LOGTYPE_STOP = 'STOP';

const dbConfig = {
    dbname: 'TimeasrDB',
    dbversion: 1,
    tables: [
        {
            tableName: DB_STORE_TIMELOG,
            keyPath: 'tlId',
            autoIncrement: false,
            indexes: [
                {
                    indexName: DB_STORE_BYTIME_INDEX,
                    indexPath: 'recTime',
                    unique: true
                }
            ]
        }
    ]
};

let initializedStore;
let timeLogList;

function convertDayCountToDay(dayCount) {
    return Date.now() + (dayCount * 86400000);
}

function init() {
    if (!initializedStore) {
        initializedStore = PersistentStore.init(dbConfig);
    }
}

function getTimeLogs(trx, { fromEpoch = 0, toEpoch = 0 }) {
    const lastDayTimes = new Promise((resolve, reject) => {
        const trxStore = trx.objectStore(DB_STORE_TIMELOG);
        const byTimeIndex = trxStore.index(DB_STORE_BYTIME_INDEX);
        const range = (toEpoch > fromEpoch)
            ? IDBKeyRange.bound(fromEpoch, toEpoch)
            : IDBKeyRange.lowerBound(fromEpoch);
        const cursorRequest = byTimeIndex.openCursor(range, 'prev');

        const receivedTimeLogList = [];
        cursorRequest.onerror = (error) => {
            reject(error);
        };
        cursorRequest.onsuccess = (evt) => {
            const cursor = evt.target.result;
            if (cursor) {
                receivedTimeLogList.push(cursor.value);
                cursor.continue();
            } else {
                resolve(receivedTimeLogList);
            }
        };
    });
    return lastDayTimes;

}

export function getTimeLogsOfPeriod(fromEpoch, toEpoch) {
    init();
    return PersistentStore
        .runQuery({
            data: { fromEpoch: fromEpoch, toEpoch },
            objectStore: DB_STORE_TIMELOG,
            writable: false,
            queryFunction: getTimeLogs
        });
}

export function getAllTimeLogs(lastDaysCount = 10) {
    if (timeLogList) {
        return Promise.resolve(timeLogList);
    }

    return getTimeLogsOfPeriod(convertDayCountToDay(-lastDaysCount))
        .then((logList) => {
            timeLogList = logList;
            return timeLogList;
        });
}

export function getLastTimeLog() {
    return new Promise((resolve) => {
        getAllTimeLogs().then((allTimeLogs) => {
            const lastTimeLog = 0 < allTimeLogs.length ? allTimeLogs[0] : null;
            resolve(lastTimeLog);
        });
    });
}

function addTimeLogQuery(trx, timelogEntry) {
    const addingResult = new Promise((resolve) => {
        const timelogStore = trx.objectStore(DB_STORE_TIMELOG);
        const request = timelogStore.put(timelogEntry);

        request.onsuccess = (evt) => {
            resolve(evt.target.result);
        }
    });
    return addingResult;
}

export function createTimeLog({ predefinedRecEpoch, timelogComment }) {
    return new Promise((resolve) => {
        getLastTimeLog().then((lastTimeLog) => {
            const newTimeLog = {
                type: (lastTimeLog && lastTimeLog.type === LOGTYPE_START ? LOGTYPE_STOP : LOGTYPE_START),
                recTime: predefinedRecEpoch || Date.now(),
                tlId: uuidv4()
            };
            if (newTimeLog.type === LOGTYPE_START && timelogComment) {
                newTimeLog.comment = timelogComment;
            }
            PersistentStore
                .runQuery({
                    data: newTimeLog,
                    objectStore: DB_STORE_TIMELOG,
                    writable: true,
                    queryFunction: addTimeLogQuery
                })
                .then(() => {
                    if (timeLogList) {
                        timeLogList = [newTimeLog].concat(timeLogList);
                    }
                    resolve(newTimeLog);
                });
        });
    });
}
