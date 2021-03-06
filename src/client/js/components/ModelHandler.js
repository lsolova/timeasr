import { createTimeLogEntry } from 'scripts/services/timeLogService';
import { LOGTYPE_STOP, LOGTYPE_START } from '../../../scripts/services/timeLogDefinitions';
import { now } from 'scripts/utils/dateUtils';
import * as MeasureTime from './MeasureTime';
import * as store from './PersistentStore';
import * as timeUtils from '../../../scripts/utils/timeConversion';

const storeConfig = {
    requiredDbVersion: 2,
    keys: {
        dailyWorkload: 'dwl',
        databaseVersion: 'dbversion',
        monthlyAdjustment: 'mwa',
        oldestDay: 'firstday',
        lastStartTime: 'startOn',
        taskTypes: 'taskTypes'
    }
};

let actualDay;

function cleanup() {
    var firstRemoveTime = timeUtils.asTimeInMillis(store.get(storeConfig.keys.oldestDay)),
        firstRemovableTime = now() - (65 * 86400000)
        ;
    if (firstRemoveTime === null) {
        return;
    }

    while (firstRemoveTime < firstRemovableTime) {
        store.remove(timeUtils.asDay(firstRemoveTime));
        firstRemoveTime = firstRemoveTime + 86400000;
    }
    store.set(storeConfig.keys.oldestDay, timeUtils.asDay(firstRemoveTime));
}

function upgrade(fromVersion, toVersion) {
    var day, dayTime, dayTimeLength, i, j, upgradedTime
        ;
    for (i = fromVersion; i < toVersion; i++) {
        switch (i) {
            case 1:
                for (j = 70; j > 0; j--) {
                    day = timeUtils.asDay(now() - (j * 86400000));
                    dayTime = store.get(day);
                    if (dayTime !== null) {
                        dayTimeLength = dayTime.length;
                        upgradedTime = (2 < dayTimeLength
                            ? parseInt(dayTime.substring(0, dayTimeLength - 2), 10) * 60
                            : 0
                        )
                            + parseInt(dayTime.substring(dayTimeLength - 2), 10);
                        store.set(day, upgradedTime);
                    }
                }
                break;
            default:
                break;
        }
    }
}

function checkAndUpgradeDatabase() {
    var dbversion = store.get(storeConfig.keys.databaseVersion);
    if (dbversion !== null) {
        dbversion = parseInt(dbversion, 10);
    }
    if (dbversion === null || dbversion !== storeConfig.requiredDbVersion) {
        upgrade(dbversion, storeConfig.requiredDbVersion);
        store.set(storeConfig.keys.databaseVersion, storeConfig.requiredDbVersion);
    }
}

function initialize() {
    checkAndUpgradeDatabase();
}

export default function ModelHandler() {
    initialize();
    return {
        add,
        getActualDay,
        getDailyWorkload,
        getMonthlyAdjustment,
        getTaskTypes,
        getTimeOfDay,
        incrementActualDay,
        setActualDay,
        setDailyWorkload,
        setMonthlyAdjustment,
        setTaskTypes,
        getMonthlyMeasuredTimes,
        lastStartTime,
        startMeasurement,
        stopMeasurement,
        getCurrentMeasuringMinutes
    }
}

export function add(measureTime) {
    var firstDay = store.get(storeConfig.keys.oldestDay);
    store.set(measureTime.getFullDay(), measureTime.getMinutes());
    if (firstDay === null || firstDay === undefined) {
        store.set(storeConfig.keys.oldestDay, measureTime.getFullDay());
    } else {
        cleanup();
    }
}

export function getActualDay() {
    if (!actualDay) {
        actualDay = getTimeOfDay(timeUtils.asDay(now()));
    }
    return actualDay;
}

export function incrementActualDay(currentMeasuringMinutes) {
    let actualDay = getActualDay();
    actualDay.addMinutes(currentMeasuringMinutes);
    store.set(actualDay.getFullDay(), actualDay.getMinutes());
}

export function setActualDay(sign) {
    actualDay = getTimeOfDay(timeUtils.siblingDay(getActualDay().getFullDay(), sign));
    return actualDay;
}

export function getDailyWorkload(month) {
    return parseInt(store.getOrSet(month + storeConfig.keys.dailyWorkload, 480), 10);
}

export function setDailyWorkload(month, value) {
    store.set(month + storeConfig.keys.dailyWorkload, value);
}

export function getMonthlyAdjustment(month) {
    return store.getOrSet(month + storeConfig.keys.monthlyAdjustment, timeUtils.asHoursAndMinutes(0));
}

export function setMonthlyAdjustment(month, value) {
    store.set(month + storeConfig.keys.monthlyAdjustment, value);
}

export function getTaskTypes() {
    return JSON.parse(store.getOrSet(storeConfig.keys.taskTypes, '[]'));
}

export function setTaskTypes(taskTypes) {
    store.set(storeConfig.keys.taskTypes, JSON.stringify(taskTypes));
}

export function getTimeOfDay(day) {
    var dayValue = store.get(day);
    if (dayValue === null || dayValue === undefined) {
        return MeasureTime.create(day, 0);
    }
    return MeasureTime.create(day, dayValue);
}

export function getMonthlyMeasuredTimes(day) {
    const measuredTimes = [];
    for (let i = 1; i < day.getDay(); i++) {
        measuredTimes.push(getTimeOfDay(day.getFullDay().substring(0, 6) + timeUtils.addLeadingZeros(i)));
    }
    return measuredTimes;
}

export function lastStartTime(value) {
    if (value) {
        store.set(storeConfig.keys.lastStartTime, value);
    } else
        if (value === null) {
            store.remove(storeConfig.keys.lastStartTime);
        } else {
            value = store.get(storeConfig.keys.lastStartTime, value)
        }
    return value;
}

export function getCurrentMeasuringMinutes(startTime, stopTime) {
    var measuringMinutes = 0;
    startTime = startTime || lastStartTime();
    stopTime = stopTime || now();
    if (startTime && startTime < stopTime) {
        measuringMinutes = Math.round((stopTime - startTime) / 60000);
    }
    return  measuringMinutes;
}

export function startMeasurement(startTime, timeLogComment) {
    lastStartTime(startTime);
    return setLogRecord({
        timeLogComment: timeLogComment || '',
        type: LOGTYPE_START
    });
}

export function stopMeasurement(stopTime) {
    const lastStartTimeValue = lastStartTime();
    incrementActualDay(getCurrentMeasuringMinutes(lastStartTimeValue));
    lastStartTime(null);
    return setLogRecord({
        type: LOGTYPE_STOP
    });
}

function setLogRecord(timeLogContent) {
    return createTimeLogEntry(timeLogContent);
}
