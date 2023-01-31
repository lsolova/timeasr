export type UUID = string;
export type Milliseconds = number;
export const defaultNamespace = "default";
export const defaultTask = "default";

export type StartedTimelog = {
    logId: UUID;
    startTime: number;
    task: string | "default";
    namespace: string | "default";
};
export type FinishedTimelog = {
    closingLogId: UUID;
    endTime: number;
} & StartedTimelog;
export type Timelog = StartedTimelog | FinishedTimelog;
export type Task = {
    active?: boolean;
    loggedTime: Milliseconds;
    name: string;
    namespace: string | "default";
};
export type Stat = {
    averageTimePerDay: Milliseconds;
    dayCount: number;
    daily: {
        leftTimeByDay: {
            remaining: Milliseconds;
            estimatedLeave: Milliseconds;
        }
        leftTimeByOverall: {
            remaining: Milliseconds;
            estimatedLeave: Milliseconds;
        }
        lastChangeTime: Milliseconds;
    };
};

export const isTimelogFinished = (timelog: Timelog): timelog is FinishedTimelog => {
    return Reflect.has(timelog, "endTime");
};
