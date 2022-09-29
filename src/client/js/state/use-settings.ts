import { useDispatch, useSelector } from "react-redux";
import { calculateMonthlyAdjustmentFromDetails } from "../logic/time-calculation";
import { SettingsActionTypes, StoreState } from "./interfaces";
import getSettingsRepository from "../logic/settings-repository";
import { useSelectedDay } from "./use-selected-day";

export const useSettings = () => {
    const dispatch = useDispatch();
    const { selectedDay } = useSelectedDay();
    const settings = useSelector(({ settings }: StoreState) => ({
        dailyWorkload: settings.expectedDailyWorkload,
        monthlyAdjustment: {
            summary: settings.monthlyAdjustment.summary,
            details: settings.monthlyAdjustment.details,
        },
        taskTypes: settings.taskTypes,
    }));
    const setDailyWorkload = (workload: number): void => {
        getSettingsRepository().setDailyWorkload(selectedDay, workload);
        dispatch({
            type: SettingsActionTypes.UPDATE_DAILY_WORKLOAD,
            value: workload,
        });
    };
    const setMonthlyAdjustment = (monthlyAdjustment: string): void => {
        getSettingsRepository().setMonthlyAdjustmentDetails(
            selectedDay,
            monthlyAdjustment
        );
        dispatch({
            type: SettingsActionTypes.UPDATE_MONTHLY_ADJUSTMENT,
            value: {
                summary:
                    calculateMonthlyAdjustmentFromDetails(monthlyAdjustment),
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
