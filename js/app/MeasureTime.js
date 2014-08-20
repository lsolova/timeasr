"use strict";
define(['tu'], function (TimeUtils) {
    var MeasureTime = function () {
        this._day = TimeUtils.asDay(Date.now());
        this._hours = "0";
        this._minutes = "0";
    };

    MeasureTime.create = function (day, time) {
        var mTimeInstance = new MeasureTime();
        mTimeInstance._day = day;
        var hourLength = 1;
        if (time.length === 4) {
            hourLength = 2;
        }
        mTimeInstance._hours = time.substring(0, hourLength);
        mTimeInstance._minutes = TimeUtils.reduce(time.substring(hourLength));
        return mTimeInstance;
    };

    MeasureTime.prototype.getDay = function () {
        return parseInt(TimeUtils.reduce(this._day.substring(6,8)), 10);
    };

    MeasureTime.prototype.getYearAndMonth = function () {
        return this._day.substring(0, 4) + "/" + this._day.substring(4, 6);
    };

    MeasureTime.prototype.getFullDay = function () {
        return this._day;
    };

    MeasureTime.prototype.getMinutes = function () {
        return parseInt(this._hours, 10) * 60 + parseInt(this._minutes, 10);
    };

    MeasureTime.prototype.getTime = function () {
        return this._hours + ":" + TimeUtils.extend(this._minutes);
    };

    MeasureTime.prototype.getRecordTime = function () {
        return "" + this._hours + TimeUtils.extend(this._minutes);
    };

    MeasureTime.prototype.increment = function (addMinutes) {
        var newMinutes = parseInt(this._minutes, 10) + addMinutes;
        while (60 <= newMinutes) {
            newMinutes = newMinutes-60;
            this._hours++;
        }
        this._minutes = newMinutes;
    };

    return MeasureTime;
});