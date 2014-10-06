"use strict";
define(['tu'], function (TimeUtils) {
    return {
        create: function(day, minutes) {
            var MeasureTime = function (day, minutes) {
                this.day = day || TimeUtils.asDay(Date.now());
                this.minutes = parseInt(minutes, 10) || 0;
            };
            MeasureTime.prototype.getDay = function getDay() {
                return parseInt(TimeUtils.reduce(this.day.substring(6,8)), 10);
            };

            MeasureTime.prototype.getYearAndMonth = function () {
                return this.day.substring(0, 4) + "/" + this.day.substring(4, 6);
            };

            MeasureTime.prototype.getFullDay = function () {
                return this.day;
            };

            MeasureTime.prototype.getMinutes = function () {
                return this.minutes;
            };

            MeasureTime.prototype.increment = function (addMinutes) {
                this.minutes += addMinutes;
            };
            return new MeasureTime(day, minutes);
        }
    };

});