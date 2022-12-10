import { now } from "./browser-wrapper";
import { ONE_DAY_WORKTIME, parseTimelogsToStat, parseTimelogsToTasks } from "./model-parsers";
import { FIRST_TASK, SECOND_TASK, THIRD_TASK } from "./__fixtures__/tasks";
import {
    FIFTH_FULL_TIMELOG,
    FIRST_FULL_TIMELOG,
    MORE_THAN_WORKDAY_TIMELOG,
    SECOND_FULL_TIMELOG,
    SIXTH_FULL_TIMELOG,
} from "./__fixtures__/timelogs";

describe("Model parser", () => {
    describe("parseTimelogsToTasks() returns", () => {
        test("empty array, if no timelogs passed", () => {
            expect(parseTimelogsToTasks([], now())).toStrictEqual([]);
        });
        test("a single item, if a timelog is passed", () => {
            expect(parseTimelogsToTasks([FIRST_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)).toStrictEqual([
                FIRST_TASK,
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
    });
    describe("parseTimelogsToStat() returns", () => {
        test("negative left time by day, if actual day longer than a workday", () => {
            const leftTimeByDay = parseTimelogsToStat([MORE_THAN_WORKDAY_TIMELOG], 1641057840000).daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual(-5436000);
        });
        test("negative left time by day, if actual day longer than a workday and there are logs from more days", () => {
            const leftTimeByDay = parseTimelogsToStat([FIRST_FULL_TIMELOG, MORE_THAN_WORKDAY_TIMELOG], 1641057840000)
                .daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual(-5436000);
        });
        test("full workday left time by overall, if there are logs for previous days only", () => {
            const leftTimeByDay = parseTimelogsToStat([FIRST_FULL_TIMELOG, MORE_THAN_WORKDAY_TIMELOG], 1641115744000)
                .daily.leftTimeByDay;
            expect(leftTimeByDay).toStrictEqual(ONE_DAY_WORKTIME);
        });
        test("negative left time by overall, if previous days were longer than a workday", () => {
            const leftTimeByOverall = parseTimelogsToStat([MORE_THAN_WORKDAY_TIMELOG], 1641115744000).daily
                .leftTimeByOverall;
            expect(leftTimeByOverall).toStrictEqual(-5436000);
        });
    });
});
