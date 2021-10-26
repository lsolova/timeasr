import { AnyAction, Reducer } from "redux";
import { ONE_MINUTE_MILLISECS, TimelogEntry } from "../../interfaces";
import { initialState } from "../initial-state";
import { MeasurementsActionTypes, MeasurementState } from "../interfaces";

const measurementInfosReducer: Reducer = <T>(state: MeasurementState, action: AnyAction): MeasurementState => {
    if (state === undefined) {
        return initialState.measurementInfo;
    }
    switch (action.type) {
        case MeasurementsActionTypes.SET_DAYINFO:
            return {
                dayInfo: action.value,
                monthInfo: state.monthInfo,
            }
        case MeasurementsActionTypes.SET_MONTHINFO:
            return {
                dayInfo: state.dayInfo,
                monthInfo: action.value,
            }
        case MeasurementsActionTypes.START_MEASUREMENT:
            const updatedTimelog = [
                ...state.dayInfo.timelog,
                action.value
            ];
            return {
                dayInfo: {...state.dayInfo, timelog: updatedTimelog},
                monthInfo: state.monthInfo,
            }
        case MeasurementsActionTypes.STOP_MEASUREMENT:
            const itemToClose = action.value;
            if (itemToClose) {
                const alreadyClosedItems = state.dayInfo.timelog.filter((logItem) => logItem.tlid !== itemToClose.tlid);
                const updatedTimelog = [
                    ...alreadyClosedItems,
                    itemToClose
                ];
                return {
                    dayInfo: {
                        ...state.dayInfo,
                        // FIXME: calculations should be done on a different place, dayInfo should be immutable
                        loggedMinutes: state.dayInfo.loggedMinutes + ((itemToClose.endTime - itemToClose.startTime) / ONE_MINUTE_MILLISECS),
                        timelog: updatedTimelog
                    },
                    monthInfo: state.monthInfo,
                }
            }
            return state;
        default:
            return state;
    }
}

export default measurementInfosReducer;
