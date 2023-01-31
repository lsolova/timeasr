import { defaultNamespace, defaultTask } from "../../types";
import { StartTimelogEntry, TimelogEntry } from "../types";

export const FIRST_START_ENTRY = {
    logId: "7e2b07d2-a090-4474-aeb3-a6a3e3ba6ac1",
    logTime: 1663942832356,
    logType: "start",
    task: "sample task",
    namespace: defaultNamespace,
} as TimelogEntry;
export const FIRST_END_ENTRY = {
    logId: "134c73dd-2568-41e9-be08-96a068f938d6",
    logTime: 1663942979608,
    logType: "end",
} as TimelogEntry;
export const SECOND_START_ENTRY = {
    logId: "3e06be87-7163-439a-8693-ca94c1549f30",
    logTime: 1663945172232,
    logType: "start",
    task: "sample task",
    namespace: defaultNamespace,
} as StartTimelogEntry;
export const SECOND_END_ENTRY = {
    logId: "e051775a-9845-4f58-adef-36f65b44f70c",
    logTime: 1663946177983,
    logType: "end",
} as TimelogEntry;
export const THIRD_START_ENTRY = {
    logId: "e7dc97d6-c8fd-45d2-b9b6-c221685f6d65",
    logTime: 1663948849344,
    logType: "start",
    task: defaultTask,
    namespace: defaultNamespace,
} as TimelogEntry;
export const THIRD_END_ENTRY = {
    logId: "e4ec6e3a-ef35-496e-a814-a84cbed595a4",
    logTime: 1663950762397,
    logType: "end",
} as TimelogEntry;
export const FOURTH_START_ENTRY = {
    logId: "c4cb2936-dd51-496d-941b-76713ffbbba4",
    logTime: 1663950762398,
    logType: "start",
    task: defaultTask,
    namespace: defaultNamespace,
} as TimelogEntry;
export const FOURTH_END_ENTRY = {
    logId: "8f874dca-6848-4d55-87ba-8cda8daa4b52",
    logTime: 1663950762499,
    logType: "end",
} as TimelogEntry;
