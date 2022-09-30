import { IndexedDbMocker } from "./persistent-store/indexed-db.mock";

import { DB_CONFIG } from "./types";
import { FIRST_END_ENTRY, FIRST_FULL_TIMELOG, FIRST_START_ENTRY, FIRST_START_TIMELOG, FOURTH_START_ENTRY, FOURTH_START_TIMELOG, SECOND_END_ENTRY, SECOND_FULL_TIMELOG, SECOND_START_ENTRY, SECOND_START_TIMELOG, THIRD_END_ENTRY, THIRD_START_ENTRY, THIRD_START_TIMELOG } from "./__fixtures__/all-fixtures";
import { TimeasrStore } from "./timeasr-store";
import * as BrowserWrapper from "./browser-wrapper";

describe("Timeasr Store", () => {
    afterEach(() => {
        IndexedDbMocker.reset();
    });
    it("initialize() sets the proper database configuration", async () => {
        await TimeasrStore.initialize();
        expect(IndexedDbMocker.getDatabaseConfig()).toStrictEqual(DB_CONFIG);
    });
    describe("getLastTimelog()", () => {
        it("returns null - if no log exists yet", async () => {
            IndexedDbMocker.setRunQueryFn(() => Promise.resolve([]));
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getLastTimelog()).toBeNull();
        });
        it("returns the last timelog - if it is full timelog", async () => {
            IndexedDbMocker.setRunQueryFn(() => Promise.resolve([FIRST_END_ENTRY, FIRST_START_ENTRY]));
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getLastTimelog()).toStrictEqual(FIRST_FULL_TIMELOG);
        });
        it("returns the last timelog - if it is started timelog", async () => {
            IndexedDbMocker.setRunQueryFn(() => Promise.resolve([FIRST_START_ENTRY]));
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getLastTimelog()).toStrictEqual(FIRST_START_TIMELOG);
        });
    });
    describe("getTimelogsOfPeriod()", () => {
        it("returns empty array - if it is requested from the beginning of time and there are no logs", async () => {
            IndexedDbMocker.setRunQueryFn(() => Promise.resolve([]));
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getTimelogsOfPeriod(0)).toStrictEqual([]);
        });
        it("returns empty array - if no logs are existing for the specified period", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([SECOND_START_ENTRY, FIRST_END_ENTRY, FIRST_START_ENTRY])
            );
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getTimelogsOfPeriod(1663948849344, 1663950860047)).toStrictEqual([]);
        });
        it("returns all timelogs - if it is requested from the beginning of time and logs are existing", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([SECOND_START_ENTRY, FIRST_END_ENTRY, FIRST_START_ENTRY])
            );
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getTimelogsOfPeriod(0)).toStrictEqual([
                SECOND_START_TIMELOG,
                FIRST_FULL_TIMELOG,
            ]);
        });
        it("returns timelogs for selected period (if period include whole timelog)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    THIRD_END_ENTRY,
                    THIRD_START_ENTRY,
                    SECOND_END_ENTRY,
                    SECOND_START_ENTRY,
                    FIRST_END_ENTRY,
                    FIRST_START_ENTRY,
                ])
            );
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getTimelogsOfPeriod(1663945172232, 1663946177983)).toStrictEqual([
                SECOND_FULL_TIMELOG,
            ]);
        });
        it("returns timelogs for selected period (if period start overlaps with timelog)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    THIRD_END_ENTRY,
                    THIRD_START_ENTRY,
                    SECOND_END_ENTRY,
                    SECOND_START_ENTRY,
                    FIRST_END_ENTRY,
                    FIRST_START_ENTRY,
                ])
            );
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getTimelogsOfPeriod(1663945172230, 1663945172235)).toStrictEqual([
                SECOND_FULL_TIMELOG,
            ]);
        });
        it("returns timelogs for selected period (if period end overlaps with timelog)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    THIRD_END_ENTRY,
                    THIRD_START_ENTRY,
                    SECOND_END_ENTRY,
                    SECOND_START_ENTRY,
                    FIRST_END_ENTRY,
                    FIRST_START_ENTRY,
                ])
            );
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getTimelogsOfPeriod(1663946177980, 1663946177985)).toStrictEqual([
                SECOND_FULL_TIMELOG,
            ]);
        });
        it("returns timelogs for selected period (if period is until now and timelog is running)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    THIRD_START_ENTRY,
                    SECOND_END_ENTRY,
                    SECOND_START_ENTRY,
                    FIRST_END_ENTRY,
                    FIRST_START_ENTRY,
                ])
            );
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => THIRD_END_ENTRY.logTime);
            await TimeasrStore.initialize();
            return expect(TimeasrStore.getTimelogsOfPeriod(THIRD_START_ENTRY.logTime + 1000)).toStrictEqual([
                THIRD_START_TIMELOG,
            ]);
        });
    });
    describe("startTimelog()", () => {
        it("creates a start Timelog - if there is no running task", async () => {
            const runQueryFn = jest.fn().mockImplementation(() => []);
            IndexedDbMocker.setRunQueryFn(runQueryFn);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => SECOND_START_ENTRY.logTime);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => SECOND_START_ENTRY.logId);

            await TimeasrStore.initialize();
            await TimeasrStore.startTimelog(SECOND_START_ENTRY.task);
            expect(runQueryFn).toHaveBeenLastCalledWith(expect.objectContaining({ data: SECOND_START_ENTRY }));
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(SECOND_START_TIMELOG);
        });
        it("creates a close and start Timelog - if there is a running task", async () => {
            let randomUUIDCallCount = 0;
            const runQueryFn = jest.fn().mockImplementation(() => [THIRD_START_ENTRY]);
            IndexedDbMocker.setRunQueryFn(runQueryFn);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => FOURTH_START_ENTRY.logTime);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => {
                const logIds = [THIRD_END_ENTRY.logId, FOURTH_START_ENTRY.logId];
                const currentLogId = logIds[randomUUIDCallCount];
                randomUUIDCallCount += 1;
                return currentLogId;
            });

            await TimeasrStore.initialize();
            await TimeasrStore.startTimelog();
            expect(runQueryFn).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    data: THIRD_END_ENTRY,
                })
            );
            expect(runQueryFn).toHaveBeenNthCalledWith(3, expect.objectContaining({ data: FOURTH_START_ENTRY }));
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(FOURTH_START_TIMELOG);
        });
        it("creates an end Timelog", async () => {
            const runQueryFn = jest.fn().mockImplementation(() => [SECOND_START_ENTRY]);
            IndexedDbMocker.setRunQueryFn(runQueryFn);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => SECOND_END_ENTRY.logTime + 1);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => SECOND_END_ENTRY.logId);

            await TimeasrStore.initialize();
            await TimeasrStore.closeTimelog();
            expect(runQueryFn).toHaveBeenLastCalledWith(expect.objectContaining({ data: SECOND_END_ENTRY }));
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(SECOND_FULL_TIMELOG);
        });
    });
});
