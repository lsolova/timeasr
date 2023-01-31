import { defaultNamespace, defaultTask } from "../types";
import { now } from "./browser-wrapper";
import { ONE_DAY_WORKTIME, parseTimelogsToStat, parseTimelogsToTasks, parseToTaskAndNamespace } from "./model-parsers";
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
            expect(parseTimelogsToTasks([], now())).toStrictEqual([]);
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
            const leftTimeByDay = parseTimelogsToStat([MORE_THAN_WORKDAY_TIMELOG], 1641057840000).daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual({
                remaining: -5436000,
                estimatedLeave: 1641052404000,
            });
        });
        test("negative left time by day, if actual day longer than a workday and there are logs from more days", () => {
            const leftTimeByDay = parseTimelogsToStat([FIRST_FULL_TIMELOG, MORE_THAN_WORKDAY_TIMELOG], 1641057840000)
                .daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual({
                remaining: -5436000,
                estimatedLeave: 1641052404000,
            });
        });
        test("active time by day, if there is an active log", () => {
            const leftTimeByDay = parseTimelogsToStat([FIRST_START_TIMELOG], FIRST_FULL_TIMELOG.endTime)
                .daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual({
                remaining: ONE_DAY_WORKTIME - (FIRST_FULL_TIMELOG.endTime - FIRST_FULL_TIMELOG.startTime),
                estimatedLeave: FIRST_START_TIMELOG.startTime + ONE_DAY_WORKTIME,
            });
        });
        test("full workday left time by overall, if there are logs for previous days only", () => {
            const leftTimeByDay = parseTimelogsToStat([FIRST_FULL_TIMELOG, MORE_THAN_WORKDAY_TIMELOG], 1641115744000)
                .daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual({
                remaining: ONE_DAY_WORKTIME,
                estimatedLeave: 1641144544000,
            });
        });
        test("negative left time by overall, if previous days were longer than a workday", () => {
            const leftTimeByOverall = parseTimelogsToStat([MORE_THAN_WORKDAY_TIMELOG], 1641115744000).daily
                .leftTimeByOverall;
            expect(leftTimeByOverall).toStrictEqual({
                remaining: -5436000,
                estimatedLeave: 1641110308000,
            });
        });
    });
});
