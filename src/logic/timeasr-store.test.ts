import {
    FIRST_END_ENTRY,
    FIRST_FULL_TIMELOG,
    FIRST_START_ENTRY,
    FIRST_START_TIMELOG,
    FOURTH_START_ENTRY,
    FOURTH_START_TIMELOG,
    SECOND_END_ENTRY,
    SECOND_FULL_TIMELOG,
    SECOND_START_ENTRY,
    SECOND_START_TIMELOG,
    THIRD_END_ENTRY,
    THIRD_START_ENTRY,
    THIRD_START_TIMELOG,
} from "./__fixtures__/all-fixtures";
import { MockBinding } from "./persistent-store/mock-binding";
import { TimeasrStore } from "./timeasr-store";
import * as BrowserWrapper from "./browser-wrapper";

describe("Timeasr Store", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });
    test("initialize() sets the proper database configuration", async () => {
        const bindingInitFn = jest.spyOn(MockBinding, "initializeDB");
        await TimeasrStore.initialize(MockBinding);
        expect(bindingInitFn).toHaveBeenCalledTimes(1);
    });
    describe("getLastTimelog()", () => {
        test("returns null - if no log exists yet", async () => {
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getLastTimelog()).toBeNull();
        });
        test("returns the last timelog - if it is full timelog", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([FIRST_END_ENTRY, FIRST_START_ENTRY]);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getLastTimelog()).toStrictEqual(FIRST_FULL_TIMELOG);
        });
        test("returns the last timelog - if it is started timelog", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([FIRST_START_ENTRY]);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getLastTimelog()).toStrictEqual(FIRST_START_TIMELOG);
        });
    });
    describe("getTimelogsOfPeriod()", () => {
        test("returns empty array - if it is requested from the beginning of time and there are no logs", async () => {
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getTimelogsOfPeriod(0)).toStrictEqual([]);
        });
        test("returns empty array - if no logs are existing for the specified period", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([
                SECOND_START_ENTRY,
                FIRST_END_ENTRY,
                FIRST_START_ENTRY,
            ]);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getTimelogsOfPeriod(1663948849344, 1663950860047)).toStrictEqual([]);
        });
        test("returns all timelogs - if it is requested from the beginning of time and logs are existing", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([
                SECOND_START_ENTRY,
                FIRST_END_ENTRY,
                FIRST_START_ENTRY,
            ]);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getTimelogsOfPeriod(0)).toStrictEqual([
                SECOND_START_TIMELOG,
                FIRST_FULL_TIMELOG,
            ]);
        });
        test("returns timelogs for selected period (if period include whole timelog)", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([
                THIRD_END_ENTRY,
                THIRD_START_ENTRY,
                SECOND_END_ENTRY,
                SECOND_START_ENTRY,
                FIRST_END_ENTRY,
                FIRST_START_ENTRY,
            ]);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getTimelogsOfPeriod(1663945172232, 1663946177983)).toStrictEqual([
                SECOND_FULL_TIMELOG,
            ]);
        });
        test("returns timelogs for selected period (if period start overlaps with timelog)", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([
                THIRD_END_ENTRY,
                THIRD_START_ENTRY,
                SECOND_END_ENTRY,
                SECOND_START_ENTRY,
                FIRST_END_ENTRY,
                FIRST_START_ENTRY,
            ]);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getTimelogsOfPeriod(1663945172230, 1663945172235)).toStrictEqual([
                SECOND_FULL_TIMELOG,
            ]);
        });
        test("returns timelogs for selected period (if period end overlaps with timelog)", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([
                THIRD_END_ENTRY,
                THIRD_START_ENTRY,
                SECOND_END_ENTRY,
                SECOND_START_ENTRY,
                FIRST_END_ENTRY,
                FIRST_START_ENTRY,
            ]);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getTimelogsOfPeriod(1663946177980, 1663946177985)).toStrictEqual([
                SECOND_FULL_TIMELOG,
            ]);
        });
        test("returns timelogs for selected period (if period is until now and timelog is running)", async () => {
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([
                THIRD_START_ENTRY,
                SECOND_END_ENTRY,
                SECOND_START_ENTRY,
                FIRST_END_ENTRY,
                FIRST_START_ENTRY,
            ]);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => THIRD_END_ENTRY.logTime);
            await TimeasrStore.initialize(MockBinding);
            return expect(TimeasrStore.getTimelogsOfPeriod(THIRD_START_ENTRY.logTime + 1000)).toStrictEqual([
                THIRD_START_TIMELOG,
            ]);
        });
    });
    describe("startTimelog()", () => {
        test("creates a start Timelog - if there is no running task", async () => {
            const persistTimelogEntryMock = jest.spyOn(MockBinding, "persistTimelogEntry");
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => SECOND_START_ENTRY.logTime);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => SECOND_START_ENTRY.logId);

            await TimeasrStore.initialize(MockBinding);
            await TimeasrStore.startTimelog(SECOND_START_ENTRY.task);
            expect(persistTimelogEntryMock).toHaveBeenLastCalledWith(SECOND_START_ENTRY);
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(SECOND_START_TIMELOG);
        });
        test("creates a close and start Timelog - if there is a running task", async () => {
            let randomUUIDCallCount = 0;
            const persistTimelogEntryMock = jest.spyOn(MockBinding, "persistTimelogEntry");
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([THIRD_START_ENTRY]);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => FOURTH_START_ENTRY.logTime);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => {
                const logIds = [THIRD_END_ENTRY.logId, FOURTH_START_ENTRY.logId];
                const currentLogId = logIds[randomUUIDCallCount];
                randomUUIDCallCount += 1;
                return currentLogId;
            });

            await TimeasrStore.initialize(MockBinding);
            await TimeasrStore.startTimelog();
            expect(persistTimelogEntryMock).toHaveBeenNthCalledWith(1, THIRD_END_ENTRY);
            expect(persistTimelogEntryMock).toHaveBeenNthCalledWith(2, FOURTH_START_ENTRY);
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(FOURTH_START_TIMELOG);
        });
        test("creates an end Timelog", async () => {
            const persistTimelogEntryMock = jest.spyOn(MockBinding, "persistTimelogEntry");
            jest.spyOn(MockBinding, "getTimelogEntries").mockResolvedValue([SECOND_START_ENTRY]);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => SECOND_END_ENTRY.logTime + 1);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => SECOND_END_ENTRY.logId);

            await TimeasrStore.initialize(MockBinding);
            await TimeasrStore.closeTimelog();
            expect(persistTimelogEntryMock).toHaveBeenLastCalledWith(SECOND_END_ENTRY);
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(SECOND_FULL_TIMELOG);
        });
    });
});
