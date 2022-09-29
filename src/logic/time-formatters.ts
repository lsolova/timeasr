export const toHoursAndMinutes = (timeInMillis: number) => {
    const minutes = Math.floor(timeInMillis / 1000 / 60) || 0;
    return `${Math.floor(minutes / 60)}:${(minutes % 60).toString().padStart(2, "0")}`;
};
