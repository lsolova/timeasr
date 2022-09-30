import { DatabaseConfiguration } from "./persistent-store/types";

const SETTING_ENTRY_KEY_NAME = "settingId";
const SETTING_ENTRY_TIME_NAME = "settingTime";
const TIMELOG_ENTRY_KEY_NAME = "logId";
const TIMELOG_ENTRY_TIME_NAME = "logTime";
export const DB_STORE_BYTIME_INDEX = "by-time-index";
export const DB_STORE_SETTINGS = "settings";
export const DB_STORE_TIMELOG = "timelog";

type epoch = number;
type json = string;
type LogType = "start" | "end";
export type TimelogEntry = {
    [TIMELOG_ENTRY_KEY_NAME]: string;
    [TIMELOG_ENTRY_TIME_NAME]: epoch;
    logType: LogType;
    task?: string;
};
export type SettingEntry = {
    [SETTING_ENTRY_KEY_NAME]: string;
    [SETTING_ENTRY_TIME_NAME]: epoch;
    value: json;
};

export const DB_CONFIG: DatabaseConfiguration = {
    dbName: "timeasr-db",
    dbVersion: 3,
    tables: [
        {
            tableName: DB_STORE_TIMELOG,
            keyPath: TIMELOG_ENTRY_KEY_NAME,
            autoIncrement: false,
            indices: [
                {
                    indexName: DB_STORE_BYTIME_INDEX,
                    indexPath: TIMELOG_ENTRY_TIME_NAME,
                    unique: true,
                },
            ],
        },
        {
            tableName: DB_STORE_SETTINGS,
            keyPath: SETTING_ENTRY_KEY_NAME,
            autoIncrement: false,
        },
    ],
};
