export const toHoursAndMinutes = (timeInMillis: number) => {
    const sign = timeInMillis < 0 ? "-" : "";
    const minutes = Math.floor(Math.abs(timeInMillis) / 1000 / 60) || 0;
    return `${sign}${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, "0")}`;
};
