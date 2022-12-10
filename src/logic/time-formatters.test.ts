import { toHoursAndMinutes } from "./time-formatters";

describe("Time formatters", () => {
    test.each<{ result: string; timeInMillis: number }>([
        { result: "-1:18", timeInMillis: -4680000 },
        { result: "-0:27", timeInMillis: -1620000 },
        { result: "1:12", timeInMillis: 4320000 },
        { result: "0:02", timeInMillis: 120000 },
    ])("returns $result if input is $timeInMillis", ({ result, timeInMillis }) => {
        expect(toHoursAndMinutes(timeInMillis)).toStrictEqual(result);
    });
});
