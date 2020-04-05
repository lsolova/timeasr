import * as TimeLogDbAdapter from './timeLogPersistingService';
import * as TimeConversion from 'scripts/utils/timeConversion';

export function getLastChangeTime() {
    return new Promise((resolve) => {
        TimeLogDbAdapter.getLastTimeLog().then((lastTimeLog) => {
            resolve(lastTimeLog && lastTimeLog.recTime);
        });
    });
}

export function createTimeLogEntry(timelogComment) {
    return new Promise((resolve) => {
        TimeLogDbAdapter.createTimeLog({
            timelogComment
        }).then((createdTimeLog) => {
            resolve(createdTimeLog.recTime);
        });
    });
}

function getDayDetails(dayTime) {
    return new Promise((resolve) => {
        const dayStartTime = TimeConversion.dayStart(dayTime);
        resolve({
            //TimeLogDbAdapter.getTimeLogsOfPeriod(dayStartTime, dayStartTime + 86400000);
        });
    });
}

export function getTodayDetails() {
    return getDayDetails(Date.now());
}
