import { IndexedDbMocker } from "./persistent-store/indexed-db.mock";

import { DB_CONFIG } from "./types";
import { TimeasrStore } from "./timeasr-store";
import * as BrowserWrapper from "./browser-wrapper";
import * as F from "./__fixtures__/all-fixtures";

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
            expect(TimeasrStore.getLastTimelog()).toBeNull();
        });
        it("returns the last timelog - if it is full timelog", async () => {
            IndexedDbMocker.setRunQueryFn(() => Promise.resolve([F.FIRST_END_ENTRY, F.FIRST_START_ENTRY]));
            await TimeasrStore.initialize();
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(F.FIRST_FULL_TIMELOG);
        });
        it("returns the last timelog - if it is started timelog", async () => {
            IndexedDbMocker.setRunQueryFn(() => Promise.resolve([F.FIRST_START_ENTRY]));
            await TimeasrStore.initialize();
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(F.FIRST_START_TIMELOG);
        });
    });
    describe("getTimelogsOfPeriod()", () => {
        it("returns empty array - if it is requested from the beginning of time and there are no logs", async () => {
            IndexedDbMocker.setRunQueryFn(() => Promise.resolve([]));
            await TimeasrStore.initialize();
            expect(TimeasrStore.getTimelogsOfPeriod(0)).toStrictEqual([]);
        });
        it("returns empty array - if no logs are existing for the specified period", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([F.SECOND_START_ENTRY, F.FIRST_END_ENTRY, F.FIRST_START_ENTRY])
            );
            await TimeasrStore.initialize();
            expect(TimeasrStore.getTimelogsOfPeriod(1663948849344, 1663950860047)).toStrictEqual([]);
        });
        it("returns all timelogs - if it is requested from the beginning of time and logs are existing", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([F.SECOND_START_ENTRY, F.FIRST_END_ENTRY, F.FIRST_START_ENTRY])
            );
            await TimeasrStore.initialize();
            expect(TimeasrStore.getTimelogsOfPeriod(0)).toStrictEqual([F.SECOND_START_TIMELOG, F.FIRST_FULL_TIMELOG]);
        });
        it("returns timelogs for selected period (if period include whole timelog)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    F.THIRD_END_ENTRY,
                    F.THIRD_START_ENTRY,
                    F.SECOND_END_ENTRY,
                    F.SECOND_START_ENTRY,
                    F.FIRST_END_ENTRY,
                    F.FIRST_START_ENTRY,
                ])
            );
            await TimeasrStore.initialize();
            expect(TimeasrStore.getTimelogsOfPeriod(1663945172232, 1663946177983)).toStrictEqual([
                F.SECOND_FULL_TIMELOG,
            ]);
        });
        it("returns timelogs for selected period (if period start overlaps with timelog)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    F.THIRD_END_ENTRY,
                    F.THIRD_START_ENTRY,
                    F.SECOND_END_ENTRY,
                    F.SECOND_START_ENTRY,
                    F.FIRST_END_ENTRY,
                    F.FIRST_START_ENTRY,
                ])
            );
            await TimeasrStore.initialize();
            expect(TimeasrStore.getTimelogsOfPeriod(1663945172230, 1663945172235)).toStrictEqual([
                F.SECOND_FULL_TIMELOG,
            ]);
        });
        it("returns timelogs for selected period (if period end overlaps with timelog)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    F.THIRD_END_ENTRY,
                    F.THIRD_START_ENTRY,
                    F.SECOND_END_ENTRY,
                    F.SECOND_START_ENTRY,
                    F.FIRST_END_ENTRY,
                    F.FIRST_START_ENTRY,
                ])
            );
            await TimeasrStore.initialize();
            expect(TimeasrStore.getTimelogsOfPeriod(1663946177980, 1663946177985)).toStrictEqual([
                F.SECOND_FULL_TIMELOG,
            ]);
        });
        it("returns timelogs for selected period (if period is until now and timelog is running)", async () => {
            IndexedDbMocker.setRunQueryFn(() =>
                Promise.resolve([
                    F.THIRD_START_ENTRY,
                    F.SECOND_END_ENTRY,
                    F.SECOND_START_ENTRY,
                    F.FIRST_END_ENTRY,
                    F.FIRST_START_ENTRY,
                ])
            );
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => F.THIRD_END_ENTRY.logTime);
            await TimeasrStore.initialize();
            expect(TimeasrStore.getTimelogsOfPeriod(F.THIRD_START_ENTRY.logTime + 1000)).toStrictEqual([
                F.THIRD_START_TIMELOG,
            ]);
        });
    });
    describe("startTimelog()", () => {
        it("creates a start Timelog - if there is no running task", async () => {
            expect.assertions(2);

            const runQueryFn = jest.fn().mockImplementation(() => []);
            IndexedDbMocker.setRunQueryFn(runQueryFn);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => F.SECOND_START_ENTRY.logTime);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => F.SECOND_START_ENTRY.logId);

            await TimeasrStore.initialize();
            await TimeasrStore.startTimelog(F.SECOND_START_ENTRY.task);
            expect(runQueryFn).toHaveBeenLastCalledWith(expect.objectContaining({ data: F.SECOND_START_ENTRY }));
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(F.SECOND_START_TIMELOG);
        });
        it("creates a close and start timelog - if there is a running task", async () => {
            expect.assertions(3);

            let randomUUIDCallCount = 0;
            const runQueryFn = jest.fn().mockImplementation(() => [F.THIRD_START_ENTRY]);
            IndexedDbMocker.setRunQueryFn(runQueryFn);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => F.FOURTH_START_ENTRY.logTime);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => {
                const logIds = [F.THIRD_END_ENTRY.logId, F.FOURTH_START_ENTRY.logId];
                const currentLogId = logIds[randomUUIDCallCount];
                randomUUIDCallCount += 1;
                return currentLogId;
            });

            await TimeasrStore.initialize();
            await TimeasrStore.startTimelog();
            expect(runQueryFn).toHaveBeenNthCalledWith(
                2,
                expect.objectContaining({
                    data: F.THIRD_END_ENTRY,
                })
            );
            expect(runQueryFn).toHaveBeenNthCalledWith(3, expect.objectContaining({ data: F.FOURTH_START_ENTRY }));
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(F.FOURTH_START_TIMELOG);
        });
    });
    describe("closeTimelog()", () => {
        it("does nothing, if there is no running timelog", async () => {
            expect.assertions(2);
            const runQueryFn = jest.fn().mockImplementation(() => [F.SECOND_END_ENTRY, F.SECOND_START_ENTRY]);
            IndexedDbMocker.setRunQueryFn(runQueryFn);

            await TimeasrStore.initialize();
            await TimeasrStore.closeTimelog();

            expect(runQueryFn).toHaveBeenCalledTimes(1); // When getting
            expect(TimeasrStore.getTimelogsOfPeriod(0)).toStrictEqual([F.SECOND_FULL_TIMELOG]);
        });
        it("creates a close timelog", async () => {
            expect.assertions(2);
            const runQueryFn = jest.fn().mockImplementation(() => [F.SECOND_START_ENTRY]);
            IndexedDbMocker.setRunQueryFn(runQueryFn);
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => F.SECOND_END_ENTRY.logTime + 1);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => F.SECOND_END_ENTRY.logId);

            await TimeasrStore.initialize();
            await TimeasrStore.closeTimelog();
            expect(runQueryFn).toHaveBeenLastCalledWith(expect.objectContaining({ data: F.SECOND_END_ENTRY }));
            expect(TimeasrStore.getLastTimelog()).toStrictEqual(F.SECOND_FULL_TIMELOG);
        });
    });
});
