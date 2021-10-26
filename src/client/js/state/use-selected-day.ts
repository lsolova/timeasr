import { useDispatch, useSelector } from "react-redux";
import { SelectedDayActionTypes, StoreState } from "./interfaces";

export function useSelectedDay() {
    const dispatch = useDispatch();
    const selectedDay = useSelector((state: StoreState) => state.selectedDay);
    return {
        selectedDay,
        selectedMonth: selectedDay.substr(0,6),
        setSelectedDay: (newSelectedDay: string) => {
            dispatch({
                type: SelectedDayActionTypes.SET_SELECTED_DAY,
                value: newSelectedDay
            });
        }
    }
}
