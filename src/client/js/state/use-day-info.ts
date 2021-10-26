import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { asTimeInMillis } from "../logic/time-conversion";
import { closeTimelogEntry, createTimelogEntry, getDayDetails } from "../logic/timelog-repository";
import { Day, DayInfo, TimelogEntry } from "../interfaces";
import { MeasurementsActionTypes, StoreState } from "./interfaces";

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

    const start = (taskType: string): Promise<TimelogEntry> => {
        return createTimelogEntry(taskType)
            .then((newItem) => {
                dispatch({
                    type: MeasurementsActionTypes.START_MEASUREMENT,
                    value: newItem
                });
                return newItem;
            });
    }
    const stop = (timelogEntry: TimelogEntry): Promise<TimelogEntry> => {
        return closeTimelogEntry(timelogEntry)
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
