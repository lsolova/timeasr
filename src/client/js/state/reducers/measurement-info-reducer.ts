import { AnyAction, Reducer } from "redux";
import { initialState } from "../initial-state";
import { MeasurementsActionTypes, MeasurementState } from "../interfaces";

const measurementInfosReducer: Reducer = (state: MeasurementState, action: AnyAction): MeasurementState => {
    if (state === undefined) {
        return initialState.measurementInfo;
    }
    const actionValue = action.value;
    switch (action.type) {
        case MeasurementsActionTypes.SET_DAYINFO:
            return {
                dayInfo: actionValue,
                monthInfo: state.monthInfo,
            }
        case MeasurementsActionTypes.SET_MONTHINFO:
            return {
                dayInfo: state.dayInfo,
                monthInfo: actionValue,
            }
        case MeasurementsActionTypes.START_MEASUREMENT:
            return {
                dayInfo: {...state.dayInfo, timelog: [
                    ...state.dayInfo.timelog,
                    actionValue
                ]},
                monthInfo: state.monthInfo,
            }
        case MeasurementsActionTypes.STOP_MEASUREMENT:
            if (actionValue) {
                const alreadyClosedItems = state.dayInfo.timelog.filter((logItem) => logItem.tlid !== actionValue.tlid);
                const updatedTimelog = [
                    ...alreadyClosedItems,
                    actionValue
                ];
                return {
                    dayInfo: {
                        ...state.dayInfo,
                        // FIXME: calculations should be done on a different place, dayInfo should be immutable
                        loggedMinutes:
                            state.dayInfo.loggedMinutes + (actionValue.endTime - actionValue.startTime) / (60 * 1000),
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
