export interface TimelogEntry {
    tlid: string;
    startTime: number;
    endTime: number | null;
    task?: string;
}

export interface DayInfo {
    day: Day;
    timelog: TimelogEntry[];
    loggedMinutes: number;
}

export interface MonthInfo {
    month: Month;
    days: Map<Day, DayInfo>;
}

export type Day = string;
export type Month = string;
export type TaskType = string;

export const ONE_MINUTE_MILLISECS = 60000;
