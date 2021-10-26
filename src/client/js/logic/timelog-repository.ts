import { asDay, asMonth, asTimeInMillis, dayEnd, dayStart, siblingDay } from './time-conversion';
import { Day, DayInfo, MonthInfo, ONE_MINUTE_MILLISECS, TimelogEntry } from '../interfaces';
import { getLastTimelog, getTimelogsOfPeriod, saveTimelog } from './timeasr-store';
import { now } from './browser-wrapper';
import { v4 as uuidv4 } from 'uuid';

const addTimelogEntryToDayInfo = (dayInfo: DayInfo, timelogEntry: TimelogEntry): void => {
    dayInfo.timelog.push(timelogEntry);
    if (timelogEntry.endTime) {
        dayInfo.loggedMinutes += (timelogEntry.endTime - timelogEntry.startTime) / ONE_MINUTE_MILLISECS;
    }
}

export function getLastChangeTime(): Promise<number> {
    return new Promise((resolve) => {
        getLastTimelog().then((lastTimeLog) => {
            resolve(lastTimeLog && lastTimeLog.endTime || lastTimeLog.startTime);
        });
    });
}

export function createTimelogEntry(task: string, startTime?: number): Promise<TimelogEntry> {
    const newTimeLog: TimelogEntry = {
        tlid: uuidv4(),
        startTime: startTime || now(),
        endTime: null,
    };
    if (task) {
        newTimeLog.task = task;
    }
    return saveTimelog(newTimeLog);
}

export function closeTimelogEntry(timelogEntry: TimelogEntry): Promise<TimelogEntry> {
    if (!timelogEntry.endTime) {
        timelogEntry.endTime = now();
        return saveTimelog(timelogEntry);
    }
    return Promise.resolve(timelogEntry);
}

export function createDayInfo(day: Day) {
    return { day, timelog: [], loggedMinutes: 0};
}

export function getDayDetails(dayTime: number): Promise<DayInfo> {
    const fromEpoch = dayStart(dayTime);
    const toEpoch = dayEnd(dayTime);
    return getTimelogsOfPeriod(fromEpoch, toEpoch)
        .then((timelogs) => {
            return timelogs.reduce((dayInfo, timelogEntry) => {
                addTimelogEntryToDayInfo(dayInfo, timelogEntry);
                return dayInfo;
            }, createDayInfo(asDay(fromEpoch)));

        });
}

export function getMonthDetails(dayTime: number): Promise<MonthInfo> {
    const month = asMonth(dayTime);
    const fromEpoch = dayStart(asTimeInMillis(`${month}01`));
    const toEpoch = dayEnd(asTimeInMillis(siblingDay(asDay(dayTime), -1)));
    return getTimelogsOfPeriod(fromEpoch, toEpoch)
        .then((timelogs) => {
            return timelogs.reduce((monthInfo, timelogEntry) => {
                const entryDay = asDay(timelogEntry.startTime);
                if (!monthInfo.days.has(entryDay)) {
                    monthInfo.days.set(entryDay, createDayInfo(entryDay));
                }
                const dayInfo = monthInfo.days.get(entryDay);
                addTimelogEntryToDayInfo(dayInfo, timelogEntry);
                return monthInfo;
            }, {
                days: new Map<Day, DayInfo>(),
                month
            } as MonthInfo);
        });
}

export function getTodayDetails() {
    return getDayDetails(now());
}
