import { AnyAction, Reducer } from "redux";
import getSettingsRepository from "../../logic/settings-repository";
import { calculateMonthlyAdjustmentFromDetails } from "../../logic/time-calculation";
import { initialState } from "../initial-state";
import { SettingsActionTypes, SettingsState } from "../interfaces";

const settingsReducer: Reducer = (state: SettingsState, action: AnyAction): SettingsState => {
    if (!state) {
        state = initialState.settings;
    }
    const maDetails = getSettingsRepository().getMonthlyAdjustmentDetails(action.value);
    switch (action.type) {
        case SettingsActionTypes.LOAD_SETTINGS:
            return {
                expectedDailyWorkload: getSettingsRepository().getDailyWorkload(action.value),
                monthlyAdjustment: {
                    summary: calculateMonthlyAdjustmentFromDetails(maDetails),
                    details: maDetails,
                },
                taskTypes: getSettingsRepository().getTaskTypes()
            }
        case SettingsActionTypes.UPDATE_DAILY_WORKLOAD:
            return {
                ...state,
                expectedDailyWorkload: action.value,
            }
        case SettingsActionTypes.UPDATE_MONTHLY_ADJUSTMENT:
            return {
                ...state,
                monthlyAdjustment: {
                    summary: action.value.summary,
                    details: action.value.details,
                }
            }
        case SettingsActionTypes.UPDATE_TASK_TYPES:
            return {
                ...state,
                taskTypes: action.value
            }
        default:
            return state;
    }
}

export default settingsReducer;
