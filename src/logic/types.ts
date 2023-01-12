import { UUID } from "../types";

export const SETTING_ENTRY_KEY_NAME = "settingId";
export const SETTING_ENTRY_TIME_NAME = "settingTime";
export const TIMELOG_ENTRY_KEY_NAME = "logId";
export const TIMELOG_ENTRY_TIME_NAME = "logTime";

type epoch = number;
type json = string;
type LogType = "start" | "end";

type BasicTimelogEntry = {
    [TIMELOG_ENTRY_KEY_NAME]: string;
    [TIMELOG_ENTRY_TIME_NAME]: epoch;
    logType: LogType;
};
type StartTimelogEntry = {
    logType: "start";
    namespace: string | "default";
    task: string | "default";
} & BasicTimelogEntry;
type EndTimelogEntry = {
    logType: "end";
} & BasicTimelogEntry;

export type TimelogEntry = StartTimelogEntry | EndTimelogEntry;
export type SettingEntry = {
    [SETTING_ENTRY_KEY_NAME]: string;
    [SETTING_ENTRY_TIME_NAME]: epoch;
    value: json;
};

export type TimeasrStoreBinding = {
    initializeDB: () => Promise<void>;
    getTimelogEntries: () => Promise<TimelogEntry[]>;
    persistTimelogEntry: (timelogEntry: TimelogEntry) => Promise<UUID>;
};
