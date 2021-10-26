import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Day, DayInfo } from "../interfaces";
import { asTimeInMillis } from "../logic/time-conversion";
import { getMonthDetails } from "../logic/timelog-repository";
import { MeasurementsActionTypes, StoreState } from "./interfaces";

export function useMonthInfo(day: Day, dailyWorkload: number) {
    const dispatch = useDispatch();
    useEffect(() => {
        getMonthDetails(asTimeInMillis(day)).then((monthInfo) => {
            dispatch({
                type: MeasurementsActionTypes.SET_MONTHINFO,
                value: monthInfo,
            })
        })
    }, [day]);
    const monthInfo = useSelector((state: StoreState) => state.measurementInfo.monthInfo);
    const workDaysCount = monthInfo.days.size;
    const workMinutesCount = workDaysCount === 0 ? 0 : Array.from(monthInfo.days.values()).reduce((minutesCount: number, dayInfo: DayInfo) => minutesCount + dayInfo.loggedMinutes, 0);
    const workMinutesDiff = workDaysCount === 0 ? 0 : Math.floor(workMinutesCount - workDaysCount * dailyWorkload);
    return {
        workDaysCount,
        workMinutesCount,
        workMinutesDiff,
    }
}
