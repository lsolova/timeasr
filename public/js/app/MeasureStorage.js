"use strict";
define(['mt', 'tu'], function (MeasureTime, TimeUtils) {
    var store = window.localStorage,
        self,
        cleanUp = function () {
            var firstRemoveTime = TimeUtils.asTimeInMillis(store.getItem('firstday')),
                firstRemovableTime = Date.now() - (65 * 86400000)
                ;
            if (firstRemoveTime === null) {
                return;
            }

            while (firstRemoveTime < firstRemovableTime) {
                store.removeItem(TimeUtils.asDay(firstRemoveTime));
                firstRemoveTime = firstRemoveTime + 86400000;
            }
            store.setItem('firstday', TimeUtils.asDay(firstRemoveTime));
        },
        upgrade = function(fromVersion, toVersion) {
            var day, dayTime, dayTimeLength, i, j, upgradedTime
                ;
            for (i = fromVersion; i < toVersion; i++) {
                switch (i) {
                    case 1 :
                        for (j = 70; j > 0; j--) {
                            day = TimeUtils.asDay(Date.now() - (j * 86400000));
                            dayTime = store.getItem(day);
                            if (dayTime !== null) {
                                dayTimeLength = dayTime.length;
                                upgradedTime = (2 < dayTimeLength
                                        ? parseInt(dayTime.substring(0, dayTimeLength - 2)) * 60
                                        : 0
                                    )
                                    + parseInt(dayTime.substring(dayTimeLength - 2));
                                store.setItem(day, upgradedTime);
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
        },
        dbversion,
        requiredDbVersion = 2,
        MeasureStorage = function () {
            self = this;
            dbversion = this.get('dbversion');
            if (dbversion !== null) {
                dbversion = parseInt(dbversion, 10);
            }
            if (dbversion === null || dbversion !== requiredDbVersion) {
                upgrade(dbversion, requiredDbVersion);
                this.set('dbversion', requiredDbVersion);
            }
        }
        ;
    MeasureStorage.prototype.add = function (measureTime) {
        store.setItem(measureTime.getFullDay(), measureTime.getMinutes());
        var firstDay = store.getItem('firstday');
        if (firstDay === null || firstDay === undefined) {
            store.setItem('firstday', measureTime.getFullDay());
        } else {
            cleanUp();
        }
    };
    MeasureStorage.prototype.get = function (key) {
        return store.getItem(key);
    };
    MeasureStorage.prototype.getOrSet = function (key, defaultValue) {
        var result = self.get(key);
        if (!result || result === null) {
            self.set(key, defaultValue);
            result = defaultValue;
        }
        return result;
    };
    MeasureStorage.prototype.getDailyWorkload = function (month) {
        return parseInt(self.getOrSet(month + 'dwl', 510), 10);
    };
    MeasureStorage.prototype.setDailyWorkload = function (month, value) {
        self.set(month + 'dwl', value);
    };
    MeasureStorage.prototype.getMonthlyAdjustment = function (month) {
        return self.getOrSet(month + 'mwa', TimeUtils.asHoursAndMinutes(0));
    };
    MeasureStorage.prototype.setMonthlyAdjustment = function (month, value) {
        self.set(month + 'mwa', value);
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
    return MeasureStorage;
});