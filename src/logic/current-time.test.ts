import { CurrentTime } from "./current-time";
import * as BrowserWrapper from "./browser-wrapper";
import { FinishedTimelog, Milliseconds, Timelog } from "../types";
import { TimeasrStore } from "./timeasr-store";

const CURRENT_TIME_IN_MILLIS = new Date(2023, 4, 2, 12, 54, 49).getTime();

describe("Current time handler", () => {
    let nowMock: jest.SpyInstance;
    let getLastTimelogMock: jest.SpyInstance;
    beforeEach(() => {
        nowMock = jest.spyOn(BrowserWrapper, "now").mockImplementation(() => CURRENT_TIME_IN_MILLIS);
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
    ])("sets the proper value to the new time - $useCase", ({ expected, input, lastTimelog }) => {
        getLastTimelogMock.mockImplementation(() => lastTimelog);
        CurrentTime.set(input);
        expect(CurrentTime.get()).toStrictEqual(expected);
    });
    test("notifies listeners on change", () => {
        const eventListenerMock = jest.fn();
        CurrentTime.addEventListener(eventListenerMock);
        CurrentTime.set("11:54");
        expect(eventListenerMock).toHaveBeenCalledTimes(1);
    });
    test("returns with difference flag", () => {
        expect.assertions(2);
        const diff1 = CurrentTime.isDifferent();
        CurrentTime.set("11:54");
        const diff2 = CurrentTime.isDifferent();
        expect(diff1).toStrictEqual(false);
        expect(diff2).toStrictEqual(true);
    });
    test("resets current time after 5 minutes", () => {
        expect.assertions(2);
        CurrentTime.set("11:54");
        expect(CurrentTime.get()).toStrictEqual(CURRENT_TIME_IN_MILLIS - 3649000);
        nowMock.mockImplementation(() => CURRENT_TIME_IN_MILLIS + 300001);
        expect(CurrentTime.get()).toStrictEqual(CURRENT_TIME_IN_MILLIS + 300001);
    });
    test("keeps time if it is earlier than last log time", () => {
        getLastTimelogMock.mockImplementation(
            () =>
                ({
                    closingLogId: "closing-log-id",
                    endTime: new Date(2023, 4, 2, 9, 16, 0).getTime(),
                    logId: "log-id",
                    namespace: "default",
                    startTime: new Date(2023, 4, 2, 8, 14, 0).getTime(),
                    task: "test task",
                } as FinishedTimelog)
        );
        expect(() => CurrentTime.set("9:14")).toThrowError("Time cannot be set, it is earlier than last log.");
        expect(CurrentTime.get()).toStrictEqual(CURRENT_TIME_IN_MILLIS);
    });
});
