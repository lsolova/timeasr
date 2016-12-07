'use strict';

var timeUtils = require('../utils/time');

var MeasureTime = function (day = timeUtils.asDay(Date.now()), minutes = 0) {
    this.day = day;
    this.minutes = parseInt(minutes, 10);
};

MeasureTime.prototype.getDay = function getDay() {
    return parseInt(timeUtils.removeLeadingZero(this.day.substring(6,8)), 10);
};

MeasureTime.prototype.getYearAndMonth = function (separator = '') {
    return this.day.substring(0, 4) + separator + this.day.substring(4, 6);
};

MeasureTime.prototype.getFullDay = function () {
    return this.day;
};

MeasureTime.prototype.getMinutes = function () {
    return this.minutes;
};

MeasureTime.prototype.addMinutes = function (addMinutes = 0) {
    this.minutes += addMinutes;
};

module.exports = {
    create: function(day, minutes) {
        return new MeasureTime(day, minutes);
    }
}