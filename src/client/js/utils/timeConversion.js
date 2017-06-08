export function addLeadingZeros(value) {
    var resultValue = value.toString();
    while (resultValue.length < 2) {
        resultValue = '0' + resultValue;
    }
    return resultValue;
}

export function asDay(timeInMillis) {
    var expDate = timeInMillis !== undefined ? new Date(timeInMillis) : new Date();
    return ''
        + expDate.getFullYear()
        + addLeadingZeros(expDate.getMonth() + 1)
        + addLeadingZeros(expDate.getDate());
}

export function removeLeadingZero(value) {
    return value.startsWith('0') ? value.substr(1) : value;
}

export function asTimeInMillis(dayString) {
    var year = dayString.substring(0, 4),
        month = removeLeadingZero(dayString.substring(4, 6)) - 1,
        day = removeLeadingZero(dayString.substring(6, 8));
    return new Date(year, month, day, 0, 0, 0, 0).getTime();
}

export function asMinutes(hoursAndMinutes) {
    var isNegative,
        sign = 1,
        splittedHM;
    if (typeof hoursAndMinutes === 'string' && hoursAndMinutes.match(/^[+-]?\d{1,2}:\d{2}$/) ) {
        isNegative =  hoursAndMinutes.lastIndexOf('-') === 0;
        if (isNegative) {
            hoursAndMinutes = hoursAndMinutes.substring(1);
            sign = -1;
        }
        splittedHM = hoursAndMinutes.split(':');
        return  (parseInt(splittedHM[0], 10) * 60 + parseInt(splittedHM[1], 10)) * sign;
    } else {
        return parseInt(hoursAndMinutes, 10);
    }
}

export function asHoursAndMinutes(minutes) {
    var signum = minutes < 0 ? -1 : 1,
        absMinutes = Math.abs(minutes),
        prefix = signum < 0 ? "-" : "";
    return prefix + Math.floor(absMinutes / 60) + ":" + addLeadingZeros(absMinutes % 60);
}

export function asMonth(timeInMillis) {
    var expDate;
    if (!Number.isInteger(timeInMillis)) {
        return undefined;
    }
    expDate = new Date(timeInMillis);
    return expDate.getFullYear() + addLeadingZeros(expDate.getMonth() + 1);
}

export function siblingDay(day, direction) {
    var mSign = !direction ? 0 : direction < 0 ? -1 : 1;
    if (!day) {
        return undefined;
    }
    return asDay(asTimeInMillis(day) + (mSign * 86400000));
}