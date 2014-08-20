"use strict";
define(['mt', 'tu'], function (MeasureTime, TimeUtils) {
    var store = window.localStorage,
        cleanUp = function () {
            var firstRemoveTime = TimeUtils.asTimeInMillis(store.getItem('firstday')),
                firstRemovableTime = Date.now() - (65 * 86400000)
                ;
            if (firstRemoveTime === null)
                return;

            while (firstRemoveTime < firstRemovableTime) {
                store.removeItem(TimeUtils.asDay(firstRemoveTime));
                firstRemoveTime = firstRemoveTime + 86400000;
            }
            store.setItem('firstday', TimeUtils.asDay(firstRemoveTime));
        },
        upgrade = function(fromVersion, toVersion) {
            for (var i = fromVersion; i < toVersion; i++) {
                switch (i) {
                    default:
                        break;
                }
            }
        },
        dbversion,
        requiredDbVersion = 1,
        MeasureStorage = function () {
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
        store.setItem(measureTime.getFullDay(), measureTime.getFormattedTime());
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
    MeasureStorage.prototype.getTimeOfDay = function (day) {
        var dayValue = store.getItem(day);
        if (dayValue === null || dayValue === undefined) {
            return MeasureTime.create(day, "000");
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