import { convertTimelogToTimelogEntry, parseTimelogEntriesToTimelogs } from "./timelog-store-utils";
import { FinishedTimelog } from "../types";
import { FIRST_END_ENTRY, FIRST_FULL_TIMELOG, FIRST_START_ENTRY, FIRST_START_TIMELOG, SECOND_END_ENTRY, SECOND_FULL_TIMELOG, SECOND_START_ENTRY, SECOND_START_TIMELOG, THIRD_FULL_TIMELOG, THIRD_START_ENTRY } from "./__fixtures__/all-fixtures";
import { TimelogEntry } from "./types";
import * as BrowserWrapper from "./browser-wrapper";

describe("Timelog Store utils", () => {
    describe("convertTimelogToTimelogEntry", () => {
        test("converts full log to start log - with task", () => {
            expect(convertTimelogToTimelogEntry(FIRST_FULL_TIMELOG, "start")).toStrictEqual(FIRST_START_ENTRY);
        });
        test("converts full log to start log - without task", () => {
            expect(convertTimelogToTimelogEntry(THIRD_FULL_TIMELOG, "start")).toStrictEqual(THIRD_START_ENTRY);
        });
        test("converts full log to start log and extends if there are missing contents", () => {
            jest.spyOn(BrowserWrapper, "now").mockImplementation(() => SECOND_START_ENTRY.logTime);
            jest.spyOn(BrowserWrapper, "randomUUID").mockImplementation(() => SECOND_START_ENTRY.logId);
            expect(
                convertTimelogToTimelogEntry({ task: SECOND_START_ENTRY.task } as FinishedTimelog, "start")
            ).toStrictEqual(SECOND_START_ENTRY);
        });
        test("converts full log to end log", () => {
            expect(convertTimelogToTimelogEntry(FIRST_FULL_TIMELOG, "end")).toStrictEqual(FIRST_END_ENTRY);
        });
    });
    describe("parseTimelogEntriesToTimelogs()", () => {
        test("converts an empty entries list to an empty array", () => {
            const entries = [] as TimelogEntry[];
            expect(parseTimelogEntriesToTimelogs(entries)).toStrictEqual([] as FinishedTimelog[]);
        });
        test("converts a single start entry to a single (started) timelog", () => {
            const entries = [FIRST_START_ENTRY] as TimelogEntry[];
            expect(parseTimelogEntriesToTimelogs(entries)).toStrictEqual([FIRST_START_TIMELOG] as FinishedTimelog[]);
        });
        test("skips converting a wrong single end entry", () => {
            const entries = [FIRST_END_ENTRY] as TimelogEntry[];
            expect(parseTimelogEntriesToTimelogs(entries)).toStrictEqual([] as FinishedTimelog[]);
        });
        test("converts a single pair of entries to a single timelog", () => {
            const entries = [FIRST_END_ENTRY, FIRST_START_ENTRY] as TimelogEntry[];
            expect(parseTimelogEntriesToTimelogs(entries)).toStrictEqual([FIRST_FULL_TIMELOG] as FinishedTimelog[]);
        });
        test("converts three entries (start+end+start) to timelogs", () => {
            const entries = [SECOND_START_ENTRY, FIRST_END_ENTRY, FIRST_START_ENTRY] as TimelogEntry[];
            expect(parseTimelogEntriesToTimelogs(entries)).toStrictEqual([
                SECOND_START_TIMELOG,
                FIRST_FULL_TIMELOG,
            ] as FinishedTimelog[]);
        });
        test("converts four valid entries to timelogs", () => {
            const entries = [
                SECOND_END_ENTRY,
                SECOND_START_ENTRY,
                FIRST_END_ENTRY,
                FIRST_START_ENTRY,
            ] as TimelogEntry[];
            expect(parseTimelogEntriesToTimelogs(entries)).toStrictEqual([
                SECOND_FULL_TIMELOG,
                FIRST_FULL_TIMELOG,
            ] as FinishedTimelog[]);
        });
        test("skips converting and invalid entry", () => {
            const entries = [SECOND_END_ENTRY, FIRST_END_ENTRY, FIRST_START_ENTRY] as TimelogEntry[];
            expect(parseTimelogEntriesToTimelogs(entries)).toStrictEqual([FIRST_FULL_TIMELOG] as FinishedTimelog[]);
        });
    });
});
