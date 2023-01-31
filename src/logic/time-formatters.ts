export const toHoursAndMinutes = (timeInMillis: number): string => {
    const sign = timeInMillis < 0 ? "-" : "";
    const minutes = Math.floor(Math.abs(timeInMillis) / 1000 / 60);
    return `${sign}${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, "0")}`;
};
export const toDayTime = (timeInMillis: number): string => {
    const date = new Date(timeInMillis);
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
};
