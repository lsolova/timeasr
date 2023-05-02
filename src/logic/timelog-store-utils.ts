import { CurrentTime } from "./current-time";
import { FinishedTimelog, isTimelogFinished, StartedTimelog, Timelog } from "../types";
import { randomUUID } from "./browser-wrapper";
import { TimelogEntry } from "./types";

export const hasStartTimeWithinRequestedPeriod = (timelog: Timelog, fromEpoch: number, toEpoch: number) =>
    timelog.startTime >= fromEpoch && timelog.startTime <= toEpoch;
export const hasEndTimeWithinRequestedPeriod = (timelog: Timelog, fromEpoch: number, toEpoch: number) =>
    isTimelogFinished(timelog) && timelog.endTime >= fromEpoch && timelog.endTime <= toEpoch;
export const isTimelogRunningWithinRequestedPeriod = (
    timelog: Timelog,
    fromEpoch: number,
    toEpoch: number,
    currentEpoch: number
) => !isTimelogFinished(timelog) && currentEpoch >= fromEpoch && currentEpoch <= toEpoch;
/** Returns true if timelog is (at least partially) within the period.
 *  What should be checked? There are three cases:
 *  - timelog started within the period
 *  - timelog finished within the period
 *  - timelog is running within the period
 */
export const isTimelogWithinPeriod = (timelog: Timelog, fromEpoch: number, toEpoch: number) =>
    hasStartTimeWithinRequestedPeriod(timelog, fromEpoch, toEpoch) ||
    hasEndTimeWithinRequestedPeriod(timelog, fromEpoch, toEpoch) ||
    isTimelogRunningWithinRequestedPeriod(timelog, fromEpoch, toEpoch, CurrentTime.get());

export const convertTimelogToTimelogEntry = (
    timelog: StartedTimelog | FinishedTimelog,
    type: TimelogEntry["logType"]
): TimelogEntry => {
    const finished = isTimelogFinished(timelog);
    const timelogEntry: TimelogEntry =
        type === "start"
            ? {
                  logId: timelog.logId ?? randomUUID(),
                  logTime: timelog.startTime ?? CurrentTime.get(),
                  logType: "start",
                  namespace: timelog.namespace ?? "default",
                  task: timelog.task,
              }
            : {
                  logId: finished ? timelog.closingLogId : randomUUID(),
                  logTime: finished ? timelog.endTime : CurrentTime.get(),
                  logType: "end",
              };
    return timelogEntry;
};
export const parseTimelogEntriesToTimelogs = (timelogEntries: TimelogEntry[]): FinishedTimelog[] => {
    const entries = timelogEntries.reduce((timelogs, entry, index, entries) => {
        const isEntryValid =
            entry.logType === "start" ||
            (entry.logType === "end" && entries.length > index + 1 && entries[index + 1].logType === "start");
        if (!isEntryValid) {
            return timelogs;
        }
        if (entry.logType === "end") {
            const entryContent = {
                closingLogId: entry.logId,
                endTime: entry.logTime,
            } as FinishedTimelog;
            timelogs.unshift(entryContent);
        }
        if (entry.logType === "start") {
            const entryContent = timelogs.length
                ? timelogs[0] // Last ended item
                : ({} as FinishedTimelog);
            entryContent.logId = entry.logId;
            entryContent.startTime = entry.logTime;
            entryContent.task = entry.task;
            entryContent.namespace = entry.namespace ?? "default";
            if (!timelogs.length) {
                timelogs.unshift(entryContent);
            }
        }
        return timelogs;
    }, [] as FinishedTimelog[]);
    return entries.reverse();
};
