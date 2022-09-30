import { asDay, dayEnd, dayStart } from "./time-conversions";
import { isTimelogFinished } from "../types";
import { Milliseconds, Stat, Task } from "../types";
import { TimeasrStore } from "./timeasr-store";

const ONE_DAY_WORKTIME = 8 * 60 *60 * 1000; // Default 8 hours worktime

export const parseTimelogsToTasks = (timeInMillis: Milliseconds): Task[] => {
    // TODO Calculate only today's time
    // const todayStart = dayStart(timeInMillis);
    const todayEnd = dayEnd(timeInMillis);
    const timelogs = TimeasrStore.getTimelogsOfPeriod(dayStart(timeInMillis) - 10 * 86400000, todayEnd);
    return timelogs
        .reduce((tasks, timelog) => {
            if (timelog.task !== null) {
                const found = tasks.findIndex((task) => task.name === timelog.task);
                const selectedTimelog =
                    found > -1
                        ? tasks[found]
                        : {
                              name: timelog.task,
                              active: false,
                              loggedTime: 0,
                          } as Task;
                selectedTimelog.active = selectedTimelog.active || !isTimelogFinished(timelog);
                selectedTimelog.loggedTime +=
                    (isTimelogFinished(timelog) ? timelog.endTime : timeInMillis) - timelog.startTime;
                if (found === -1) {
                    tasks.push(selectedTimelog);
                }
            }
            return tasks;
        }, [] as Task[])
        .sort((a, b) => a?.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
};
export const parseTimelogsToStat = (timeInMillis: Milliseconds): Stat => {
    const allTimelogs = TimeasrStore.getTimelogsOfPeriod(0);
    const dayTimelogs = TimeasrStore.getTimelogsOfPeriod(dayStart(timeInMillis), dayEnd(timeInMillis));

    const allTimeInfo = allTimelogs.reduce((allTimeObject, timelog) => {
        allTimeObject.days.add(asDay(timelog.startTime));
        if (isTimelogFinished(timelog)) {
            allTimeObject.days.add(asDay(timelog.endTime));
            allTimeObject.allTime += (timelog.endTime - timelog.startTime);
        } else {
            allTimeObject.allTime += (timeInMillis - timelog.startTime);
        }
        return allTimeObject;
    }, {
        allTime: 0,
        days: new Set()
    });
    const dayTimeInfo = dayTimelogs.reduce((dayTimeObject, timelog) => {
        if (isTimelogFinished(timelog)) {
            dayTimeObject.lastChange = Math.max(dayTimeObject.lastChange, timelog.endTime);
            dayTimeObject.dayTime += (timelog.endTime - timelog.startTime);
        } else {
            dayTimeObject.lastChange = Math.max(dayTimeObject.lastChange, timelog.startTime);
            dayTimeObject.dayTime += (timeInMillis - timelog.startTime);
        }
        return dayTimeObject;
    }, {
        dayTime: 0,
        lastChange: 0
    })
    return {
        averageTimePerDay: allTimeInfo.allTime / allTimeInfo.days.size,
        dayCount: allTimeInfo.days.size,
        daily: {
            leftTimeByDay: Math.abs(ONE_DAY_WORKTIME - dayTimeInfo.dayTime),
            leftTimeByOverall: Math.abs(allTimeInfo.days.size * ONE_DAY_WORKTIME - allTimeInfo.allTime),
            lastChangeTime: dayTimeInfo.lastChange,
        },
    };
};
