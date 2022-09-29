import { Timelog } from "../../../types";

export type Day = string; //##
export type Month = string; //##
export type TaskType = string;
export type DayInfo = {
    timelog: Timelog[];
    loggedMinutes: number;
}
export type MonthInfo = {
    days: Map<Day, DayInfo>;
}

export enum SelectedDayActionTypes {
    SET_SELECTED_DAY = 'selected-day/set',
}

export enum SettingsActionTypes {
    LOAD_SETTINGS = 'settings/load',
    UPDATE_DAILY_WORKLOAD = 'settings/daily-workload/update',
    UPDATE_MONTHLY_ADJUSTMENT = 'settings/montly-adjustment/update',
    UPDATE_TASK_TYPES = 'settings/task-types/update',
}

export enum MeasurementsActionTypes {
    SET_DAYINFO = 'measurement/dayinfo/set',
    SET_MONTHINFO = 'measurement/monthinfo/set',
    START_MEASUREMENT = 'measurement/start',
    STOP_MEASUREMENT = 'measurement/stop',
}

export interface SettingsState {
    expectedDailyWorkload: number,
    monthlyAdjustment: {
        summary: number,
        details: string,
    },
    taskTypes: TaskType[],
}

export interface MeasurementState {
    dayInfo: DayInfo,
    monthInfo: MonthInfo,
}

export interface StoreState {
    settings: SettingsState,
    selectedDay: Day,
    measurementInfo: MeasurementState,
}
