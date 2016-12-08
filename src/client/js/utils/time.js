'use strict';

const timeregex = /^[+]?([-]?\d{1,2}:\d{2}) .*$/;

module.exports = {
    addLeadingZeros: function addLeadingZeros(value) {
        var resultValue = value.toString();
        while (resultValue.length < 2) {
            resultValue = '0' + resultValue;
        }
        return resultValue;
    },
    asDay: function (timeInMillis) {
        var expDate = timeInMillis !== undefined ? new Date(timeInMillis) : new Date();
        return ''
            + expDate.getFullYear()
            + this.addLeadingZeros(expDate.getMonth() + 1)
            + this.addLeadingZeros(expDate.getDate());
    },
    removeLeadingZero: function removeLeadingZero(value) {
        return value.startsWith('0') ? value.substr(1) : value;
    },



        asTimeInMillis: function (dayString) {
            var year = dayString.substring(0, 4),
                month = this.removeLeadingZero(dayString.substring(4, 6)) - 1,
                day = this.removeLeadingZero(dayString.substring(6, 8));
            return new Date(year, month, day, 0, 0, 0, 0).getTime();
        },
        asMinutes: function (hoursAndMinutes) {
             var isNegative,
                sign = 1,
                splittedHM;
            if (hoursAndMinutes.match(/^-?\d{1,2}:\d{2}$/) ) {
                isNegative =  hoursAndMinutes.lastIndexOf('-') === 0;
                if (isNegative) {
                    hoursAndMinutes = hoursAndMinutes.substring(1);
                    sign = -1;
                }
                splittedHM = hoursAndMinutes.split(':');
                return  (parseInt(splittedHM[0], 10) * 60 + parseInt(splittedHM[1], 10)) * sign;
            }
        },
        asHoursAndMinutes: function (minutes) {
            var signum = minutes < 0 ? -1 : 1,
                absMinutes = Math.abs(minutes),
                prefix = signum < 0 ? "-" : "";
            return prefix + Math.floor(absMinutes / 60) + ":" + this.addLeadingZeros(absMinutes % 60);
        },
        asMonth: function (timeInMillis) {
            var expDate = new Date(timeInMillis);
            return expDate.getFullYear() + this.addLeadingZeros(expDate.getMonth() + 1);
        },
        siblingDay: function (day, direction) {
            var mSign = 1;
            if (direction < 0) {
                mSign = -1;
            }
            return this.asDay(this.asTimeInMillis(day) + (mSign * 86400000));
        },
        getMinutesInDay: function (date) {
            return date.getHours() * 60 + date.getMinutes();
        },
        calculateMonthlyAdjustmentFromDetails: function (valueList) {
            var splitted,
                splitTrimmed,
                summarizedValue = 0,
                splitHoursAndMinutes,
                i;
            if (valueList) {
                splitted = valueList.split('\n');
                for (i = 0; i < splitted.length; i++) {
                    splitTrimmed = splitted[i].trim();
                    if (splitTrimmed.length > 0 && timeregex.test(splitTrimmed)) {
                        splitHoursAndMinutes = timeregex.exec(splitTrimmed)[1];
                        summarizedValue += this.asMinutes(splitHoursAndMinutes);
                    }
                }
            }
            return summarizedValue;
        }

}