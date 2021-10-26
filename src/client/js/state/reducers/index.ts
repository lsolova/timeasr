import { combineReducers } from "redux";
import selectedDayReducer from "./selectedday-reducer";
import settingsReducer from "./settings-reducer";
import measurementInfosReducer from "./measurement-info-reducer";

const reducers = combineReducers({
    selectedDay: selectedDayReducer,
    settings: settingsReducer,
    measurementInfo: measurementInfosReducer,
});

export default reducers;
