import { asDay, asMonth } from "../../../logic/time-conversions";
import { CurrentTime } from "../../../logic/current-time";
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
    selectedDay: asDay(CurrentTime.get()),
    // DayInfos - null by default and will be an empty array when loaded
    measurementInfo: {
        dayInfo: null,
        monthInfo: {
            month: asMonth(CurrentTime.get()),
            days: new Map<Day, DayInfo>(),
        }
    }
}
