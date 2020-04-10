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
            console.log(JSON.stringify(timeLogs));
            //[{"type":"STRT","recTime":1586104373993,"tlId":"7e1e5ea0-8bc2-445b-8d98-2d10c5df91bf"},{"type":"STOP","recTime":1586104381470,"tlId":"eeeecd66-7e78-4d94-b692-ee3c8c185eb3"},{"type":"STRT","recTime":1586104383666,"tlId":"a0ddc385-d240-4672-a398-3ac8edb175b1"},{"type":"STOP","recTime":1586104425062,"tlId":"b97daa5c-0fba-4869-acde-0e3f431ff760"},{"type":"STRT","recTime":1586104429938,"tlId":"e80eb9c5-f0d0-4fdb-adf7-281bb29b9b00","comment":"Test/depl"},{"type":"STOP","recTime":1586104430880,"tlId":"ad95f4e3-c8a8-4ca1-923c-ade656e9feb1"},{"type":"STRT","recTime":1586105297968,"tlId":"77ae1de8-4006-486c-a9d9-cc34445e0dfa","comment":"Test/depl"},{"type":"STOP","recTime":1586105299635,"tlId":"98429824-e561-4b98-bea0-63d136274760"},{"type":"STRT","recTime":1586105306993,"tlId":"c98a1750-aed8-4974-9459-f8eca97a526b","comment":"Test/depl"}]
            return timeLogs.reduce((timeLogSumArray, timeLogItem) => {
                if(timeLogItem.type === 'STRT') {
                    timeLogSumArray.lastStartTime = timeLogItem.recTime;
                    timeLogSumArray.lastTaskType = timeLogItem.comment;
                } else {
                    const knownLastTaskType = timeLogSumArray.lastTaskType || 'default';
                    if ( !timeLogSumArray.result.hasOwnProperty(knownLastTaskType)) {
                        timeLogSumArray.result[knownLastTaskType] = 0;
                    }
                    timeLogSumArray.result[knownLastTaskType] += timeLogItem.recTime - timeLogSumArray.lastStartTime;
                }
                return timeLogSumArray;
            }, { result: {}}).result;

        });
}

export function getTodayDetails() {
    return getDayDetails(Date.now());
}
