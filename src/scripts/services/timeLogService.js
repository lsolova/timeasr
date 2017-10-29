import * as PersistentStore from './persistentStore';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';

const DB_STORE_TIMELOG = 'timelog';
const DB_STORE_BYTIME_INDEX = 'byTimeIndex';

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
    return moment().subtract(dayCount, 'days').format('YYYY-MM-DD');
}

function init() {
    if (!initializedStore) {
        initializedStore = PersistentStore.init(dbConfig);
    }
}

function getTimeLogsOfLastDays(trx, firstDay) {
    const lastDayTimes = new Promise((resolve, reject) => {
        const trxStore = trx.objectStore(DB_STORE_TIMELOG);
        const byTimeIndex = trxStore.index(DB_STORE_BYTIME_INDEX);
        const range = IDBKeyRange.lowerBound(firstDay || '0');
        const cursorRequest = byTimeIndex.openCursor(range, 'prev');

        const timeLogList = [];
        cursorRequest.onerror = (error) => {
            reject(error);
        };
        cursorRequest.onsuccess = (evt) => {
            const cursor = evt.target.result;
            if (cursor) {
                timeLogList.push(cursor.value);
                cursor.continue();
            } else {
                resolve(timeLogList);
            }
        };
    });
    return lastDayTimes;
}

export function getAllTimeLogs(lastDaysCount) {
    if (timeLogList) {
        return Promise.resolve(timeLogList);
    }

    return new Promise((resolve) => {
        init();
        PersistentStore
            .runQuery({
                data: convertDayCountToDay(lastDaysCount),
                objectStore: DB_STORE_TIMELOG,
                writable: false,
                queryFunction: getTimeLogsOfLastDays
            })
            .then((logList) => {
                timeLogList = logList;
                resolve(timeLogList);
            });
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

export function createTimeLog(predefinedRecTime) {
    return new Promise((resolve) => {
        getLastTimeLog().then((lastTimeLog) => {
            const newTimeLog = {
                type: (lastTimeLog && lastTimeLog.type === 'STRT' ? 'STOP' : 'STRT'),
                recTime: (moment(predefinedRecTime) || moment()).toISOString(),
                tlId: uuidv4()
            };
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
