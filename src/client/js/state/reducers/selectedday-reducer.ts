import { AnyAction, Reducer } from "redux";
import { initialState } from "../initial-state";
import { SelectedDayActionTypes } from "../interfaces";

const selectedDayReducer: Reducer = (state: string, action: AnyAction): string => {
    if (!state) {
        return initialState.selectedDay;
    }
    switch (action.type) {
        case SelectedDayActionTypes.SET_SELECTED_DAY:
            return action.value;
        default:
            return state;
    }
}

export default selectedDayReducer;
