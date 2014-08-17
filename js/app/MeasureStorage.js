"use strict";
define(['mt', 'tu'], function (MeasureTime, TimeUtils) {
    var store = window.localStorage;
    var cleanUp = function () {
        var firstRemoveTime = TimeUtils.asTimeInMillis(store.getItem('firstday'));
        var firstRemovableTime = Date.now() - (65 * 86400000);
        if (firstRemoveTime === null)
            return;

        while (firstRemoveTime < firstRemovableTime) {
            store.removeItem(TimeUtils.asDay(firstRemoveTime));
            firstRemoveTime = firstRemoveTime + 86400000;
        }
        store.setItem('firstday', TimeUtils.asDay(firstRemoveTime));
    };
    var MeasureStorage = function () {
    };
    MeasureStorage.prototype.add = function (measureTime) {
        store.setItem(measureTime.getFullDay(), measureTime.getTime());
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
    MeasureStorage.prototype.getTime = function (day) {
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