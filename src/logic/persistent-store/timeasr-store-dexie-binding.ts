import Dexie from "dexie";
import { defaultNamespace, defaultTask } from "../../types";
import { SETTING_ENTRY_KEY_NAME, TimeasrStoreBinding, TIMELOG_ENTRY_KEY_NAME, TIMELOG_ENTRY_TIME_NAME, TimelogEntry } from "../types";
import { DB_NAME, DB_STORE_SETTINGS, DB_STORE_TIMELOG } from "./types";

let db: Dexie;

const initializeDB = async () => {
    db = new Dexie(DB_NAME);
    db.version(0.3).stores({
        [DB_STORE_TIMELOG]: `${TIMELOG_ENTRY_KEY_NAME},&${TIMELOG_ENTRY_TIME_NAME}`,
        [DB_STORE_SETTINGS]: SETTING_ENTRY_KEY_NAME,
    });
    db.version(0.4).stores({
        [DB_STORE_TIMELOG]: `${TIMELOG_ENTRY_KEY_NAME},&${TIMELOG_ENTRY_TIME_NAME}`,
        [DB_STORE_SETTINGS]: SETTING_ENTRY_KEY_NAME,
    }).upgrade((trans) => {
        trans.table(DB_STORE_TIMELOG).toCollection().modify((timelogEntry) => {
            if (timelogEntry.logType === "start" && !timelogEntry.namespace) {
                timelogEntry.namespace = defaultNamespace;
            }
            if (timelogEntry.logType === "start" && !timelogEntry.task) {
                timelogEntry.task = defaultTask;
            }
        });
    });
};

const getTimelogEntries = async () => {
    return db.table(DB_STORE_TIMELOG).orderBy("logTime").reverse().toArray();
};

const persistTimelogEntry = async (timelogEntry: TimelogEntry) => {
    await db.table(DB_STORE_TIMELOG).add(timelogEntry);
    return timelogEntry.logId;
};

export const DexieBinding: TimeasrStoreBinding = {
    initializeDB,
    getTimelogEntries,
    persistTimelogEntry,
};
