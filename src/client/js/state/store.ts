import { createStore } from "redux";
import { getTodayDetails } from "../logic/timelog-repository";
import { initialState } from "./initial-state";
import { MeasurementsActionTypes, SettingsActionTypes } from "./interfaces";
import reducers from "./reducers/index";

let storeInstance = null;

export const getStore = () => {
    if (!storeInstance) {
        storeInstance = createStore(reducers, initialState, (window as any)?.__REDUX_DEVTOOLS_EXTENSION__());
    }
    return storeInstance;
}

export const loadInitialData = () => {
    const store = getStore();
    getTodayDetails().then((dayInfo) => {
        store.dispatch({
            type: MeasurementsActionTypes.SET_DAYINFO,
            value: dayInfo,
        });
    });
    store.dispatch({
        type: SettingsActionTypes.LOAD_SETTINGS,
        value: initialState.selectedDay.substr(6),
    });
}
