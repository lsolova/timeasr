import { now } from "./browser-wrapper";
import { parseTimelogsToTasks } from "./model-parsers";
import { FIRST_TASK, SECOND_TASK, THIRD_TASK } from "./__fixtures__/tasks";
import { FIFTH_FULL_TIMELOG, FIRST_FULL_TIMELOG, SECOND_FULL_TIMELOG, SIXTH_FULL_TIMELOG } from "./__fixtures__/timelogs";

describe("Model parser", () => {
    describe("parseTimelogsToTasks", () => {
        it("returns empty array, if no timelogs passed", () => {
            expect(parseTimelogsToTasks([], now())).toStrictEqual([]);
        });
        it("returns a single item, if a timelog is passed", () => {
            expect(parseTimelogsToTasks([FIRST_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)).toStrictEqual([
                FIRST_TASK,
            ]);
        });
        it("returns a single item, if names are the same", () => {
            expect(
                parseTimelogsToTasks([FIRST_FULL_TIMELOG, SECOND_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)
            ).toStrictEqual([SECOND_TASK]);
        });
        it("returns a single item with daily calculated time, if timelogs are from different days", () => {
            expect(
                parseTimelogsToTasks([FIRST_FULL_TIMELOG, FIFTH_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)
            ).toStrictEqual([FIRST_TASK]);
        });
        it("returns multiple items, if names are different", () => {
            expect(
                parseTimelogsToTasks([FIRST_FULL_TIMELOG, SIXTH_FULL_TIMELOG], FIRST_FULL_TIMELOG.startTime + 100)
            ).toStrictEqual([FIRST_TASK, THIRD_TASK]);
        });
    });
});
