import { LOGTYPE_START } from './timeLogDefinitions';
import * as TimeConversion from 'scripts/utils/timeConversion';
import * as TimeLogDbAdapter from './timeLogPersistingService';

export function getLastChangeTime() {
    return new Promise((resolve) => {
        TimeLogDbAdapter.getLastTimeLog().then((lastTimeLog) => {
            resolve(lastTimeLog && lastTimeLog.recTime);
        });
    });
}

export function createTimeLogEntry(timeLogContent) {
    return TimeLogDbAdapter.createTimeLog(timeLogContent)
        .then((createdTimeLog) => {
            return createdTimeLog.recTime;
        });
}

function getDayDetails(dayTime) {
    const dayStartTime = TimeConversion.dayStart(dayTime);
    return TimeLogDbAdapter.getTimeLogsOfPeriod(dayStartTime, dayStartTime + 86400000)
        .then((timeLogs) => {
            timeLogs.sort((tlogA, tlogB) => {
                return tlogA.recTime - tlogB.recTime;
            });
            return timeLogs.reduce((timeLogSumArray, timeLogItem) => {
                if(timeLogItem.type === LOGTYPE_START) {
                    timeLogSumArray.lastStartTime = timeLogItem.recTime;
                    timeLogSumArray.lastTaskType = timeLogItem.comment;
                } else {
                    const knownLastTaskType = timeLogSumArray.lastTaskType || 'default';
                    if ( !timeLogSumArray.result.hasOwnProperty(knownLastTaskType)) {
                        timeLogSumArray.result[knownLastTaskType] = 0;
                    }
                    timeLogSumArray.result[knownLastTaskType] += timeLogItem.recTime - timeLogSumArray.lastStartTime;
                    timeLogSumArray.lastTaskType = null;
                }
                return timeLogSumArray;
            }, { result: {} });

        });
}

export function getTodayDetails() {
    return getDayDetails(Date.now());
}
