import { CurrentTime } from "./current-time";
import { defaultNamespace, defaultTask } from "../types";
import { parseTimelogsToStat, parseTimelogsToTasks, parseToTaskAndNamespace } from "./model-parsers";
import { FIFTH_TASK, FIRST_TASK, FOURTH_TASK, SECOND_TASK, THIRD_TASK } from "./__fixtures__/tasks";
import {
    FIFTH_FULL_TIMELOG,
    FIRST_FULL_TIMELOG,
    FIRST_START_TIMELOG,
    MORE_THAN_WORKDAY_TIMELOG,
    SECOND_FULL_TIMELOG,
    SEVENTH_FULL_TIMELOG,
    SIXTH_FULL_TIMELOG,
} from "./__fixtures__/timelogs";
import { MAX_DAY_WORKTIME, MIN_DAY_WORKTIME } from "../settings";

describe("Model parser", () => {
    describe("parseToTaskAndNamespace() returns", () => {
        test("defaults if no content provided", () => {
            expect(parseToTaskAndNamespace()).toStrictEqual({ namespace: defaultNamespace, taskName: defaultTask });
        });
        test("default namespace and taskname if no custom namespace provided", () => {
            expect(parseToTaskAndNamespace("sample task")).toStrictEqual({
                namespace: defaultNamespace,
                taskName: "sample task",
            });
        });
        test("custom namespace and taskname if no custom namespace provided", () => {
            expect(parseToTaskAndNamespace("custom ns:sample task")).toStrictEqual({
                namespace: "custom ns",
                taskName: "sample task",
            });
        });
    });
    describe("parseTimelogsToTasks() returns", () => {
        test("empty array, if no timelogs passed", () => {
            expect(parseTimelogsToTasks([], CurrentTime.get())).toStrictEqual([]);
        });
        test("a single item, if a timelog is passed", () => {
            expect(parseTimelogsToTasks([FIRST_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)).toStrictEqual([
                FIRST_TASK,
            ]);
        });
        test("a single item, if a starting timelog is passed", () => {
            expect(parseTimelogsToTasks([FIRST_START_TIMELOG], FIRST_FULL_TIMELOG.endTime)).toStrictEqual([
                { ...FIRST_TASK, active: true },
            ]);
        });
        test("a single item, if names are the same", () => {
            expect(
                parseTimelogsToTasks([FIRST_FULL_TIMELOG, SECOND_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)
            ).toStrictEqual([SECOND_TASK]);
        });
        test("a single item with daily calculated time, if timelogs are from different days", () => {
            expect(
                parseTimelogsToTasks([FIRST_FULL_TIMELOG, FIFTH_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)
            ).toStrictEqual([FIRST_TASK]);
        });
        test("multiple items, if names are different", () => {
            expect(
                parseTimelogsToTasks([FIRST_FULL_TIMELOG, SIXTH_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)
            ).toStrictEqual([FIRST_TASK, THIRD_TASK]);
        });
        test("multiple items, if namespaces are different", () => {
            expect(
                parseTimelogsToTasks([SIXTH_FULL_TIMELOG, SEVENTH_FULL_TIMELOG], SIXTH_FULL_TIMELOG.startTime + 100)
            ).toStrictEqual([FIFTH_TASK, FOURTH_TASK]);
        });
    });
    describe("parseTimelogsToStat() returns", () => {
        test("negative left time by day, if actual day longer than a workday", () => {
            const currentTime = 1641057840000;
            const leftTimeByDay = parseTimelogsToStat([MORE_THAN_WORKDAY_TIMELOG], currentTime).daily.leftTimeByDay;
            const expectedRemainingTime =
                MAX_DAY_WORKTIME - (MORE_THAN_WORKDAY_TIMELOG.endTime - MORE_THAN_WORKDAY_TIMELOG.startTime);
            expect(leftTimeByDay).toStrictEqual({
                remaining: expectedRemainingTime,
                estimatedLeave: currentTime + expectedRemainingTime,
            });
        });
        test("negative left time by day, if actual day longer than a workday and there are logs from more days", () => {
            const currentTime = 1641057840000;
            const leftTimeByDay = parseTimelogsToStat([FIRST_FULL_TIMELOG, MORE_THAN_WORKDAY_TIMELOG], currentTime)
                .daily.leftTimeByDay;
            const expectedRemainingTime =
                MIN_DAY_WORKTIME - (MORE_THAN_WORKDAY_TIMELOG.endTime - MORE_THAN_WORKDAY_TIMELOG.startTime);
            expect(leftTimeByDay).toStrictEqual({
                remaining: expectedRemainingTime,
                estimatedLeave: currentTime + expectedRemainingTime,
            });
        });
        test("active time by day, if there is an active log", () => {
            const leftTimeByDay = parseTimelogsToStat([FIRST_START_TIMELOG], FIRST_FULL_TIMELOG.endTime).daily
                .leftTimeByDay;
            const expectedRemainingTime =
                MAX_DAY_WORKTIME - (FIRST_FULL_TIMELOG.endTime - FIRST_FULL_TIMELOG.startTime);
            expect(leftTimeByDay).toStrictEqual({
                remaining: expectedRemainingTime,
                estimatedLeave: FIRST_START_TIMELOG.startTime + MAX_DAY_WORKTIME,
            });
        });
        test("full workday left time by overall, if there are logs for previous days only", () => {
            const currentTime = 1641115744000;
            const leftTimeByDay = parseTimelogsToStat([FIRST_FULL_TIMELOG, MORE_THAN_WORKDAY_TIMELOG], currentTime)
                .daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual({
                remaining: MIN_DAY_WORKTIME, // Too short previous day
                estimatedLeave: currentTime + MIN_DAY_WORKTIME,
            });
        });
        test("less left time by overall, if previous days were longer than a workday", () => {
            expect.assertions(2);
            const { leftTimeByDay, leftTimeByOverall } = parseTimelogsToStat(
                [
                    MORE_THAN_WORKDAY_TIMELOG,
                    {
                        ...FIRST_FULL_TIMELOG,
                        startTime: 1641115344000,
                        endTime: 1641115743000,
                    },
                ],
                1641115744000
            ).daily;
            expect(leftTimeByOverall).toStrictEqual({
                remaining: 22965000,
                estimatedLeave: 1641138709000,
            });
            expect(leftTimeByDay).toStrictEqual({
                remaining: 28401000,
                estimatedLeave: 1641144145000,
            });
        });
        // eslint-disable-next-line max-len
        test("exactly with overtime less left time by overall, if previous days were longer than a workday and current day not started", () => {
            expect.assertions(2);
            const { leftTimeByDay, leftTimeByOverall } = parseTimelogsToStat(
                [MORE_THAN_WORKDAY_TIMELOG],
                1641115744000
            ).daily;
            expect(leftTimeByOverall).toStrictEqual({
                remaining: 23364000,
                estimatedLeave: 1641139108000,
            });
            expect(leftTimeByDay).toStrictEqual({
                remaining: 28800000,
                estimatedLeave: 1641144544000,
            });
        });
    });
});
