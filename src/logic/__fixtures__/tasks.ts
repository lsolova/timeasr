import { FIRST_FULL_TIMELOG, SECOND_FULL_TIMELOG, SIXTH_FULL_TIMELOG } from "./timelogs";

export const FIRST_TASK = {
    active: false,
    loggedTime: FIRST_FULL_TIMELOG.endTime - FIRST_FULL_TIMELOG.startTime,
    name: "sample task",
};

export const SECOND_TASK = {
    active: false,
    loggedTime:
        FIRST_FULL_TIMELOG.endTime -
        FIRST_FULL_TIMELOG.startTime +
        SECOND_FULL_TIMELOG.endTime -
        SECOND_FULL_TIMELOG.startTime,
    name: "sample task",
};

export const THIRD_TASK = {
    active: false,
    loggedTime: 0,
    name: "sample2 task",
};

export const FOURTH_TASK = {
    active: false,
    loggedTime: SIXTH_FULL_TIMELOG.endTime - SIXTH_FULL_TIMELOG.startTime,
    name: "sample2 task",
};

export const FIFTH_TASK = {
    active: false,
    loggedTime: 0,
    name: "custom namespace:sample2 task",
};
