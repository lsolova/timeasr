import { Day } from "../interfaces";

export function addLeadingZeros(value) {
    var resultValue = value.toString();
    while (resultValue.length < 2) {
        resultValue = '0' + resultValue;
    }
    return resultValue;
}

export function removeLeadingZero(value) {
    return value.startsWith('0') ? value.substr(1) : value;
}

export function asDay(timeInMillis) {
    var expDate = timeInMillis !== undefined ? new Date(timeInMillis) : new Date();
    return ''
        + expDate.getFullYear()
        + addLeadingZeros(expDate.getMonth() + 1)
        + addLeadingZeros(expDate.getDate());
}

export function asMonth(timeInMillis) {
    var expDate;
    if (!Number.isInteger(timeInMillis)) {
        return undefined;
    }
    expDate = new Date(timeInMillis);
    return expDate.getFullYear() + addLeadingZeros(expDate.getMonth() + 1);
}

export function asFirstDayOfMonth(timeInMillis: number): Day {
    if (!Number.isInteger(timeInMillis)) {
        return undefined;
    }
    const providedDate = new Date(timeInMillis);
    return providedDate.getFullYear() + addLeadingZeros(providedDate.getMonth() + 1) + '01';
}

export function dayStart(dayTime: number): number {
    const actualDate = new Date(dayTime);
    return Date.UTC(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate(), 0, 0, 0, 0);
}

export function dayEnd(dayTime: number): number {
    const actualDate = new Date(dayTime);
    return Date.UTC(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate(), 23,59, 59, 999);
}

export function asTimeInMillis(dayValue: Day): number {
    const year = +(dayValue.substring(0, 4)),
        month = removeLeadingZero(dayValue.substring(4, 6)) - 1,
        day = +(removeLeadingZero(dayValue.substring(6, 8)));
    return Date.UTC(year, month, day, 0, 0, 0, 0);
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

export function asDecimalHours(timeInMillis) {
    const v =  timeInMillis
        ? timeInMillis / (1000 * 60 * 60)
        : 0;
    return Math.round((v + Number.EPSILON) * 100) / 100;
}

export function siblingDay(day, direction) {
    var mSign = !direction ? 0 : direction < 0 ? -1 : 1;
    if (!day) {
        return undefined;
    }
    return asDay(asTimeInMillis(day) + (mSign * 86400000));
}
