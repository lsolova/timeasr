import { CurrentTime } from "./current-time";
import * as BrowserWrapper from "./browser-wrapper";
import { Milliseconds, Timelog } from "../types";
import { TimeasrStore } from "./timeasr-store";

const CURRENT_TIME_IN_MILLIS = new Date(2023, 4, 2, 12, 54, 49).getTime();

describe("Current time handler", () => {
    let getLastTimelogMock: jest.SpyInstance;
    beforeEach(() => {
        jest.spyOn(BrowserWrapper, "now").mockImplementation(() => CURRENT_TIME_IN_MILLIS);
        getLastTimelogMock = jest.spyOn(TimeasrStore, "getLastTimelog");
    });
    afterEach(() => {
        CurrentTime.set(undefined);
        jest.resetAllMocks();
    });
    test.each<{ useCase: string; input: string; expected: Milliseconds; lastTimelog: Timelog | null }>([
        {
            useCase: "wrong formatted time - unaccepted character",
            input: "1,214",
            expected: CURRENT_TIME_IN_MILLIS,
            lastTimelog: null,
        },
        {
            useCase: "wrong formatted time - wrong syntax",
            input: "1:214",
            expected: CURRENT_TIME_IN_MILLIS,
            lastTimelog: null,
        },
        {
            useCase: "wrong formatted time - too less digits",
            input: "94",
            expected: CURRENT_TIME_IN_MILLIS,
            lastTimelog: null,
        },
        {
            useCase: "wrong formatted time - out ouf bound hours",
            input: "24:14",
            expected: CURRENT_TIME_IN_MILLIS,
            lastTimelog: null,
        },
        {
            useCase: "well formatted time - day start",
            input: "0:00",
            expected: new Date(2023, 4, 2, 0, 0, 0).getTime(),
            lastTimelog: null,
        },
        {
            useCase: "well formatted time - some time",
            input: "11:14",
            expected: new Date(2023, 4, 2, 11, 14, 0).getTime(),
            lastTimelog: null,
        },
        {
            useCase: "well formatted time - day end",
            input: "23:59",
            expected: new Date(2023, 4, 2, 23, 59, 0).getTime(),
            lastTimelog: null,
        },
        {
            useCase: "short formatted time with 4 digits",
            input: "1114",
            expected: new Date(2023, 4, 2, 11, 14, 0).getTime(),
            lastTimelog: null,
        },
        {
            useCase: "short formatted time with 3 digits",
            input: "914",
            expected: new Date(2023, 4, 2, 9, 14, 0).getTime(),
            lastTimelog: null,
        },
        {
            useCase: "well formatted but earlier than the last log",
            input: "914",
            expected: CURRENT_TIME_IN_MILLIS,
            lastTimelog: {
                closingLogId: "closing-log-id",
                endTime: new Date(2023, 4, 2, 9, 16, 0).getTime(),
                logId: "log-id",
                namespace: "default",
                startTime: new Date(2023, 4, 2, 8, 14, 0).getTime(),
                task: "test task",
            },
        },
    ])("sets the proper value to the new time - $useCase", ({ expected, input, lastTimelog }) => {
        getLastTimelogMock.mockImplementation(() => lastTimelog);
        CurrentTime.set(input);
        expect(CurrentTime.get()).toStrictEqual(expected);
    });
});
