import { asDay, dayEnd, dayStart } from "./time-conversions";
import { hasStartTimeWithinRequestedPeriod, isTimelogWithinPeriod } from "./timelog-store-utils";
import { DataStat, defaultNamespace, defaultTask, isTimelogFinished, Timelog, Milliseconds, Task } from "../types";
import { MAX_DAY_WORKTIME, MIN_DAY_WORKTIME } from "../settings";

const prepareTaskNameWithNamespace = (timelog: Timelog) =>
    `${timelog.namespace === defaultNamespace ? "" : timelog.namespace + ":"}${timelog.task}`;
export const parseToTaskAndNamespace = (taskContent?: string) => {
    let taskName = taskContent ?? defaultTask,
        namespace = defaultNamespace;
    if (taskContent) {
        const positionOfColon = taskContent.indexOf(":");
        if (positionOfColon !== -1) {
            namespace = taskContent.substring(0, positionOfColon);
            taskName = taskContent.substring(positionOfColon + 1);
        }
    }
    return { taskName, namespace };
};

export const parseTimelogsToTasks = (timelogs: Timelog[], currentEpoch: Milliseconds): Task[] => {
    const todayStart = dayStart(currentEpoch);
    const todayEnd = dayEnd(currentEpoch);
    return timelogs
        .reduce((tasks, timelog) => {
            const taskNameWithNamespace = prepareTaskNameWithNamespace(timelog);
            const found = tasks.findIndex((task) => task.name === taskNameWithNamespace);
            const isFinishedTimelog = isTimelogFinished(timelog);
            const timelogTime = (isFinishedTimelog ? timelog.endTime : currentEpoch) - timelog.startTime;
            const selectedTimelog =
                found > -1
                    ? tasks[found]
                    : ({
                          name: taskNameWithNamespace,
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
            return tasks;
        }, [] as Task[])
        .sort((a, b) => a?.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
};
export const parseTimelogsToStat = (timelogs: Timelog[], currentEpoch: Milliseconds): DataStat => {
    const todayStart = dayStart(currentEpoch);
    const todayEnd = dayEnd(currentEpoch);
    // All time except current day
    const allTimeInfo = timelogs
        .filter((timelog) => !isTimelogWithinPeriod(timelog, todayStart, todayEnd))
        .reduce(
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
    const averageTimePerDay = allTimeInfo.days.size ? allTimeInfo.allTime / allTimeInfo.days.size : 0;
    const calculatedDayWorktime =
        averageTimePerDay > 0
            ? Math.min(Math.max(MIN_DAY_WORKTIME, averageTimePerDay), MAX_DAY_WORKTIME)
            : MAX_DAY_WORKTIME;
    const leftTimeByDayRemaining = calculatedDayWorktime - dayTimeInfo.dayTime;
    const allDaysWorkload = allTimeInfo.days.size * calculatedDayWorktime;
    const leftTimeByOverallRemaining = allDaysWorkload - allTimeInfo.allTime + leftTimeByDayRemaining;
    return {
        averageTimePerDay,
        calculatedDayWorktime,
        dayCount: allTimeInfo.days.size,
        daily: {
            leftTimeByDay: {
                remaining: leftTimeByDayRemaining,
                estimatedLeave: currentEpoch + leftTimeByDayRemaining,
            },
            leftTimeByOverall: {
                remaining: leftTimeByOverallRemaining,
                estimatedLeave: currentEpoch + leftTimeByOverallRemaining,
            },
            lastChangeTime: dayTimeInfo.lastChange,
        },
    };
};
