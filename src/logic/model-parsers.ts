import { asDay, dayEnd, dayStart } from "./time-conversions";
import { hasStartTimeWithinRequestedPeriod, isTimelogWithinPeriod } from "./timelog-store-utils";
import { isTimelogFinished, Timelog } from "../types";
import { Milliseconds, Stat, Task } from "../types";

export const ONE_DAY_WORKTIME = 8 * 60 * 60 * 1000; // Default 8 hours worktime

export const parseTimelogsToTasks = (timelogs: Timelog[], currentEpoch: Milliseconds): Task[] => {
    const todayStart = dayStart(currentEpoch);
    const todayEnd = dayEnd(currentEpoch);
    return timelogs
        .reduce((tasks, timelog) => {
            if (timelog.task !== null) {
                const found = tasks.findIndex((task) => task.name === timelog.task);
                const isFinishedTimelog = isTimelogFinished(timelog);
                const timelogTime = (isFinishedTimelog ? timelog.endTime : currentEpoch) - timelog.startTime;
                const selectedTimelog =
                    found > -1
                        ? tasks[found]
                        : ({
                              name: timelog.task,
                              active: false,
                              loggedTime: 0,
                          } as Task);
                selectedTimelog.active = selectedTimelog.active || !isFinishedTimelog;
                if (hasStartTimeWithinRequestedPeriod(timelog, todayStart, todayEnd)) {
                    selectedTimelog.loggedTime += timelogTime;
                }
                if (found === -1) {
                    tasks.push(selectedTimelog);
                }
            }
            return tasks;
        }, [] as Task[])
        .sort((a, b) => a?.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
};
export const parseTimelogsToStat = (timelogs: Timelog[], currentEpoch: Milliseconds): Stat => {
    const todayStart = dayStart(currentEpoch);
    const todayEnd = dayEnd(currentEpoch);
    const allTimeInfo = timelogs.reduce(
        (allTimeObject, timelog) => {
            allTimeObject.days.add(asDay(timelog.startTime));
            if (isTimelogFinished(timelog)) {
                allTimeObject.days.add(asDay(timelog.endTime));
                allTimeObject.allTime += timelog.endTime - timelog.startTime;
            } else {
                allTimeObject.allTime += currentEpoch - timelog.startTime;
            }
            return allTimeObject;
        },
        {
            allTime: 0,
            days: new Set(),
        }
    );
    const dayTimeInfo = timelogs
        .filter((timelog) => isTimelogWithinPeriod(timelog, todayStart, todayEnd))
        .reduce(
            (dayTimeObject, timelog) => {
                if (isTimelogFinished(timelog)) {
                    dayTimeObject.lastChange = Math.max(dayTimeObject.lastChange, timelog.endTime);
                    dayTimeObject.dayTime += timelog.endTime - timelog.startTime;
                } else {
                    dayTimeObject.lastChange = Math.max(dayTimeObject.lastChange, timelog.startTime);
                    dayTimeObject.dayTime += currentEpoch - timelog.startTime;
                }
                return dayTimeObject;
            },
            {
                dayTime: 0,
                lastChange: 0,
            }
        );
    return {
        averageTimePerDay: allTimeInfo.allTime / allTimeInfo.days.size,
        dayCount: allTimeInfo.days.size,
        daily: {
            leftTimeByDay: ONE_DAY_WORKTIME - dayTimeInfo.dayTime,
            leftTimeByOverall: allTimeInfo.days.size * ONE_DAY_WORKTIME - allTimeInfo.allTime,
            lastChangeTime: dayTimeInfo.lastChange,
        },
    };
};
