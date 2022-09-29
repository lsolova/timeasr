export type UUID = string;
export type Milliseconds = number;
export type StartedTimelog = {
    logId: UUID;
    startTime: number;
    task: string | undefined;
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
};
export type Stat = {
    averageTimePerDay: Milliseconds;
    dayCount: number;
    daily: {
        leftTimeByDay: Milliseconds;
        leftTimeByOverall: Milliseconds;
        lastChangeTime: Milliseconds;
    };
};

export const isTimelogFinished = (timelog: Timelog): timelog is FinishedTimelog => {
    return Reflect.has(timelog, "endTime");
};
