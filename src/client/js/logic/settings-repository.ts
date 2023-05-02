import { asDay } from "../../../logic/time-conversions";
import { asTimeInMillis } from "./time-conversion";
import { Day } from "../state/interfaces";
import { now } from "../../../logic/browser-wrapper";
import { STORE_CONFIG } from "./store-config";
import * as localStore from "./local-storage";

interface SettingsRepository {
    getDailyWorkload(currentDay: Day): number;
    getMonthlyAdjustmentDetails(currentDay: Day): string;
    getTaskTypes(): string[];
    setDailyWorkload: (currentDay: Day, workload: number) => void;
    setMonthlyAdjustmentDetails: (currentDay: Day, montlyAdjustmentDetails: string) => void;
    setTaskTypes: (taskTypes: string[]) => void;
}

const yearAndMonthOf = (day: Day) => day.substr(0, 6);

function cleanup() {
    const nowTime = now();
    let firstRemoveTime = asTimeInMillis(localStore.get(STORE_CONFIG.keys.oldestDay) || asDay(nowTime));
    const firstRemovableTime = nowTime - 65 * 86400000;
    if (firstRemoveTime === null) {
        return;
    }

    while (firstRemoveTime < firstRemovableTime) {
        localStore.remove(asDay(firstRemoveTime));
        firstRemoveTime = firstRemoveTime + 86400000;
    }
    localStore.set(STORE_CONFIG.keys.oldestDay, asDay(firstRemoveTime));
}

function getDailyWorkload(currentDay: Day) {
    return parseInt(localStore.getOrSet(yearAndMonthOf(currentDay) + STORE_CONFIG.keys.dailyWorkload, 480), 10);
}

function setDailyWorkload(currentDay: Day, value: number) {
    localStore.set(yearAndMonthOf(currentDay) + STORE_CONFIG.keys.dailyWorkload, value);
}

export function getMonthlyAdjustmentDetails(currentDay: Day) {
    return localStore.getOrSet(yearAndMonthOf(currentDay) + STORE_CONFIG.keys.monthlyAdjustment, "");
}

export function setMonthlyAdjustmentDetails(currentDay: Day, value: string): void {
    localStore.set(yearAndMonthOf(currentDay) + STORE_CONFIG.keys.monthlyAdjustment, value);
}

export function getTaskTypes() {
    return localStore.getOrSet(STORE_CONFIG.keys.taskTypes, []);
}

export function setTaskTypes(taskTypes: string[]) {
    localStore.set(STORE_CONFIG.keys.taskTypes, taskTypes);
}

const getSettingsRepository = (): SettingsRepository => ({
    getDailyWorkload,
    getMonthlyAdjustmentDetails,
    getTaskTypes,
    setDailyWorkload,
    setMonthlyAdjustmentDetails,
    setTaskTypes,
});

export default getSettingsRepository;
cleanup();
