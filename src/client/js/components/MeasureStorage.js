'use strict';

const MeasureTime = require('./MeasureTime'),
      timeUtils = require('../utils/time'),
      requiredDbVersion = 2;
var MeasureStorage,
    store = window.localStorage,
    actualDay;

function cleanup() {
    var firstRemoveTime = timeUtils.asTimeInMillis(store.getItem('firstday')),
        firstRemovableTime = Date.now() - (65 * 86400000)
        ;
    if (firstRemoveTime === null) {
        return;
    }

    while (firstRemoveTime < firstRemovableTime) {
        store.removeItem(timeUtils.asDay(firstRemoveTime));
        firstRemoveTime = firstRemoveTime + 86400000;
    }
    store.setItem('firstday', timeUtils.asDay(firstRemoveTime));
}

function upgrade(fromVersion, toVersion) {
    var day, dayTime, dayTimeLength, i, j, upgradedTime
        ;
    for (i = fromVersion; i < toVersion; i++) {
        switch (i) {
            case 1 :
                for (j = 70; j > 0; j--) {
                    day = timeUtils.asDay(Date.now() - (j * 86400000));
                    dayTime = store.getItem(day);
                    if (dayTime !== null) {
                        dayTimeLength = dayTime.length;
                        upgradedTime = (2 < dayTimeLength
                                ? parseInt(dayTime.substring(0, dayTimeLength - 2), 10) * 60
                                : 0
                            )
                            + parseInt(dayTime.substring(dayTimeLength - 2), 10);
                        store.setItem(day, upgradedTime);
                    }
                }
                break;
            default:
                break;
        }
    }
}

MeasureStorage = function () {
    var dbversion = this.get('dbversion');
    if (dbversion !== null) {
        dbversion = parseInt(dbversion, 10);
    }
    if (dbversion === null || dbversion !== requiredDbVersion) {
        upgrade(dbversion, requiredDbVersion);
        this.set('dbversion', requiredDbVersion);
    }
    actualDay = this.getTimeOfDay(timeUtils.asDay(Date.now()));
}

MeasureStorage.prototype.add = function (measureTime) {
    var firstDay = store.getItem('firstday');
    store.setItem(measureTime.getFullDay(), measureTime.getMinutes());
    if (firstDay === null || firstDay === undefined) {
        store.setItem('firstday', measureTime.getFullDay());
    } else {
        cleanup();
    }
};
MeasureStorage.prototype.get = function (key) {
    return store.getItem(key);
};
MeasureStorage.prototype.getOrSet = function (key, defaultValue) {
    var result = this.get(key);
    if (!result || result === null) {
        this.set(key, defaultValue);
        result = defaultValue;
    }
    return result;
};
MeasureStorage.prototype.getActualDay = function () {
    return actualDay;
};
MeasureStorage.prototype.incrementActualDay = function (currentMeasuringMinutes) {
    actualDay.addMinutes(currentMeasuringMinutes);
    this.set(actualDay.getFullDay(), actualDay.getMinutes());
};
MeasureStorage.prototype.setActualDay = function (sign) {
    actualDay = this.getTimeOfDay(timeUtils.siblingDay(actualDay.getFullDay(), sign.change));
};
MeasureStorage.prototype.getDailyWorkload = function (month) {
    return parseInt(this.getOrSet(month + 'dwl', 510), 10);
};
MeasureStorage.prototype.setDailyWorkload = function (month, value) {
    this.set(month + 'dwl', value);
};
MeasureStorage.prototype.getMonthlyAdjustment = function (month) {
    return this.getOrSet(month + 'mwa', timeUtils.asHoursAndMinutes(0));
};
MeasureStorage.prototype.setMonthlyAdjustment = function (month, value) {
    this.set(month + 'mwa', value);
};
MeasureStorage.prototype.getTimeOfDay = function (day) {
    var dayValue = store.getItem(day);
    if (dayValue === null || dayValue === undefined) {
        return MeasureTime.create(day, 0);
    }
    return MeasureTime.create(day, dayValue);
};
MeasureStorage.prototype.remove = function (key) {
    store.removeItem(key);
};
MeasureStorage.prototype.set = function (key, value) {
    store.setItem(key, value);
};

module.exports = MeasureStorage;