import { Milliseconds } from "../types";

/** @deprecated */
export const addLeadingZero = (value: number) => {
    return value.toString().padStart(2, "0");
};
/** @deprecated */
export const asMonth = (timeInMillis: Milliseconds) => {
    const expDate = new Date(timeInMillis);
    return `${expDate.getFullYear()}${addLeadingZero(expDate.getMonth() + 1)}`;
};
/** @deprecated */
export const asDay = (timeInMillis: Milliseconds) => {
    const expDate = timeInMillis !== undefined ? new Date(timeInMillis) : new Date();
    return `${asMonth(timeInMillis)}${addLeadingZero(expDate.getDate())}`;
};
export const dayStart = (dayTime: Milliseconds): Milliseconds => {
    const actualDate = new Date(dayTime);
    return Date.UTC(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate(), 0, 0, 0, 0);
};
export const dayEnd = (dayTime: Milliseconds): Milliseconds => {
    const actualDate = new Date(dayTime);
    return Date.UTC(actualDate.getFullYear(), actualDate.getMonth(), actualDate.getDate(), 23, 59, 59, 999);
};
