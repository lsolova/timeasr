﻿"use strict";
define(function () {
    var TimeUtils = {
        asTimeInMillis: function (dayString) {
            return new Date(dayString.substring(0, 4), TimeUtils.reduce(dayString.substring(4, 6)) - 1, TimeUtils.reduce(dayString.substring(6,8)), 0, 0, 0, 0).getTime();
        },
        asHoursAndMinutes: function (minutes) {
            return Math.floor(minutes / 60) + ":" + TimeUtils.extend(Math.abs(minutes % 60));
        },
        asDay: function (timeInMillis) {
            var expDate = new Date(timeInMillis);
            return expDate.getFullYear() + TimeUtils.extend(expDate.getMonth() + 1) + TimeUtils.extend(expDate.getDate());
        },
        siblingDay: function (day, direction) {
            var mSign = 1;
            if (direction < 0) {
                mSign = -1;
            }
            return TimeUtils.asDay(TimeUtils.asTimeInMillis(day) + (mSign * 86400000));
        },
        extend: function (timeSlice) {
            timeSlice = "" + timeSlice;
            while (timeSlice.length < 2) {
                timeSlice = "0" + timeSlice;
            }
            return timeSlice;
        },
        reduce: function (timeSliceString) {
            if (timeSliceString.length === 2 && timeSliceString.substring(0, 1) === '0') {
                return timeSliceString.substring(1);
            }
            return timeSliceString;
        }
    };
    return TimeUtils;
});