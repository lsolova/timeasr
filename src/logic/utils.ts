import { isTimelogFinished, Milliseconds, Timelog } from "../types";

const TIME_REGEX = /^([01]?\d|2[0123])[:]?[012345]\d$/;

export const parseEnteredTime = (timeString: string | undefined) => {
    if (timeString !== undefined && !TIME_REGEX.test(timeString)) {
        return null;
    }
    const preParsedTimeString = timeString?.replaceAll(/[^\d]/g, "") ?? "";
    if (preParsedTimeString?.length >= 3) {
        const minutes = Number(preParsedTimeString.substring(preParsedTimeString.length - 2));
        const hours = Number(preParsedTimeString.substring(0, preParsedTimeString.length - 2));
        return {
            hours,
            minutes,
        };
    }
    return null;
};
export const isNewerThanLastEntry = (time: Milliseconds, lastTimelog: Timelog | null) => {
    if (lastTimelog !== null) {
        return isTimelogFinished(lastTimelog) ? lastTimelog.endTime < time : lastTimelog.startTime < time;
    }
    return true;
};
