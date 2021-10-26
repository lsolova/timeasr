import { useDispatch, useSelector } from "react-redux";
import { calculateMonthlyAdjustmentFromDetails } from "../logic/time-calculation";
import { SettingsActionTypes, StoreState } from "./interfaces";
import getSettingsRepository from "../logic/settings-repository";

export function useSettings() {
    const dispatch = useDispatch();
    const settings = useSelector((state: StoreState) => ({
        dailyWorkload: state.settings.expectedDailyWorkload,
        monthlyAdjustment: {
            summary: state.settings.monthlyAdjustment.summary,
            details: state.settings.monthlyAdjustment.details,
        },
        taskTypes: state.settings.taskTypes,
    }));
    const selectedDay = useSelector((state: StoreState) => state.selectedDay);
    const setDailyWorkload = (workload: number): void => {
        getSettingsRepository().setDailyWorkload(selectedDay, workload);
        dispatch({
            type: SettingsActionTypes.UPDATE_DAILY_WORKLOAD,
            value: workload,
        });
    }
    const setMonthlyAdjustment = (monthlyAdjustment: string): void => {
        getSettingsRepository().setMonthlyAdjustmentDetails(selectedDay, monthlyAdjustment);
        dispatch({
            type: SettingsActionTypes.UPDATE_MONTHLY_ADJUSTMENT,
            value: {
                summary: calculateMonthlyAdjustmentFromDetails(monthlyAdjustment),
                details: monthlyAdjustment,
            },
        });
    }
    const setTaskTypes = (taskTypes: string[]): void => {
        const parsedTaskTypes = taskTypes;
        getSettingsRepository().setTaskTypes(parsedTaskTypes);
        dispatch({
            type: SettingsActionTypes.UPDATE_TASK_TYPES,
            value: parsedTaskTypes,
        });
    }

    return {
        setDailyWorkload,
        setMonthlyAdjustment,
        setTaskTypes,
        settings
    }
}
