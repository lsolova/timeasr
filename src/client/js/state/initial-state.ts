import { now } from "../../../logic/browser-wrapper";
import { asDay, asMonth } from "../../../logic/time-conversions";
import { Day, DayInfo } from "./interfaces";

export const initialState = {
    // Settings
    settings: {
        expectedDailyWorkload: 8 * 60, // 8 hours
        monthlyAdjustment: {
            summary: 0,
            details: "",
        },
        taskTypes: [],
    },
    // General information about the selected day
    selectedDay: asDay(now()),
    // DayInfos - null by default and will be an empty array when loaded
    measurementInfo: {
        dayInfo: null,
        monthInfo: {
            month: asMonth(now()),
            days: new Map<Day, DayInfo>(),
        }
    }
}
