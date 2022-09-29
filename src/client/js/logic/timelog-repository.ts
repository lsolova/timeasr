import { asTimeInMillis, siblingDay } from './time-conversion';
import { isTimelogFinished, Timelog } from '../../../types';
import { TimeasrStore } from '../../../logic/timeasr-store';
import { now } from '../../../logic/browser-wrapper';
import { asDay, asMonth, dayEnd, dayStart } from '../../../logic/time-conversions';
import { Day, DayInfo, MonthInfo } from '../state/interfaces';

const addTimelogEntryToDayInfo = (dayInfo: DayInfo, timelog: Timelog): void => {
    dayInfo.timelog.push(timelog);
    if (isTimelogFinished(timelog)) {
        dayInfo.loggedMinutes += (timelog.endTime - timelog.startTime) / (60 * 1000);
    }
}

export function createDayInfo(day: Day) {
    return { day, timelog: [], loggedMinutes: 0};
}

export function getDayDetails(dayTime: number): Promise<DayInfo> {
    const fromEpoch = dayStart(dayTime);
    const toEpoch = dayEnd(dayTime);
    const timelogs = TimeasrStore.getTimelogsOfPeriod(fromEpoch, toEpoch);
            return Promise.resolve(timelogs.reduce((dayInfo, timelogEntry) => {
                addTimelogEntryToDayInfo(dayInfo, timelogEntry);
                return dayInfo;
            }, createDayInfo(asDay(fromEpoch))));

}

export function getMonthDetails(dayTime: number): Promise<MonthInfo> {
    const month = asMonth(dayTime);
    const fromEpoch = dayStart(asTimeInMillis(`${month}01`));
    const toEpoch = dayEnd(asTimeInMillis(siblingDay(asDay(dayTime), -1)));
    const timelogs = TimeasrStore.getTimelogsOfPeriod(fromEpoch, toEpoch);
    return Promise.resolve(
        timelogs.reduce(
            (monthInfo, timelogEntry) => {
                const entryDay = asDay(timelogEntry.startTime);
                if (!monthInfo.days.has(entryDay)) {
                    monthInfo.days.set(entryDay, createDayInfo(entryDay));
                }
                const dayInfo = monthInfo.days.get(entryDay);
                addTimelogEntryToDayInfo(dayInfo, timelogEntry);
                return monthInfo;
            },
            {
                days: new Map<Day, DayInfo>(),
                month,
            } as MonthInfo
        )
    );
}

export function getTodayDetails() {
    return getDayDetails(now());
}
