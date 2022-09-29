import { addLeadingZero, asDay, asMonth } from "../../../logic/time-conversions";
import { Day } from "../state/interfaces";

export function removeLeadingZero(value) {
    return value.startsWith("0") ? value.substr(1) : value;
}

// TODO
// const protectForUndefined = (fn) => {
//     return (timeInMillis: number | undefined) => {
//         if (Number.isInteger(timeInMillis)) {
//             return fn(timeInMillis);
//         }
//     }
// }

export function asFirstDayOfMonth(timeInMillis: number): Day {
    return `${asMonth(timeInMillis)}01`;
}



export function asTimeInMillis(dayValue: Day): number {
    const year = +(dayValue.substring(0, 4)),
        month = removeLeadingZero(dayValue.substring(4, 6)) - 1,
        day = +(removeLeadingZero(dayValue.substring(6, 8)));
    return Date.UTC(year, month, day, 0, 0, 0, 0);
}

export function asMinutes(hoursAndMinutes) {
    if (typeof hoursAndMinutes === 'string' && hoursAndMinutes.match(/^[+-]?\d{1,2}:\d{2}$/) ) {
        const unsignedHoursAndMinutes =
            hoursAndMinutes.lastIndexOf("-") === 0 ? hoursAndMinutes.substring(1) : hoursAndMinutes;
        const sign = hoursAndMinutes.lastIndexOf('-') === 0 ? -1 : 1;
        const splittedHM = unsignedHoursAndMinutes.split(':');
        return  (parseInt(splittedHM[0], 10) * 60 + parseInt(splittedHM[1], 10)) * sign;
    } else {
        return parseInt(hoursAndMinutes, 10);
    }
}

export function asHoursAndMinutes(minutes) {
    const signum = minutes < 0 ? -1 : 1,
        absMinutes = Math.abs(minutes),
        prefix = signum < 0 ? "-" : "";
    return prefix + Math.floor(absMinutes / 60) + ":" + addLeadingZero(absMinutes % 60);
}

export function asDecimalHours(timeInMillis) {
    const v =  timeInMillis
        ? timeInMillis / (1000 * 60 * 60)
        : 0;
    return Math.round((v + Number.EPSILON) * 100) / 100;
}

export function siblingDay(day, direction) {
    if (!day) {
        return undefined;
    }
    const mSign = !direction ? 0 : direction < 0 ? -1 : 1;
    return asDay(asTimeInMillis(day) + (mSign * 86400000));
}
