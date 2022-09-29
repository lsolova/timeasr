import { asTimeInMillis } from "../logic/time-conversion";
import { getDayDetails } from "../logic/timelog-repository";
import { Timelog } from "../../../types";
import { Day, DayInfo, MeasurementsActionTypes, StoreState } from "./interfaces";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { TimeasrStore } from "../../../logic/timeasr-store";

export function useDayInfo(day: Day) {
    const dispatch = useDispatch();

    useEffect(() => {
        getDayDetails(asTimeInMillis(day)).then((dayInfo) => {
            dispatch({
                type: MeasurementsActionTypes.SET_DAYINFO,
                value: dayInfo,
            });
        });
    }, [day]);

    const start = (taskType: string): Promise<Timelog> => {
        return TimeasrStore.startTimelog(taskType)
            .then((newItem) => {
                dispatch({
                    type: MeasurementsActionTypes.START_MEASUREMENT,
                    value: newItem
                });
                return newItem;
            });
    }
    const stop = (): Promise<Timelog> => {
        return TimeasrStore.closeTimelog()
            .then((timelog) => {
                dispatch({
                    type: MeasurementsActionTypes.STOP_MEASUREMENT,
                    value: timelog
                });
                return timelog;
            });
    }
    const dayInfo = useSelector((state: StoreState) => state.measurementInfo.dayInfo || {} as DayInfo);
    const timelog = dayInfo.timelog || [];

    return {
        start,
        stop,
        dayInfo,
        timelog,
    }
}
