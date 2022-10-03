import { toHoursAndMinutes } from "./time-formatters";

describe("Time formatters toHoursAndMinutes()", () => {
    test.each([
        ["0:00", 0],
        ["0:01", 60000],
        ["0:15", 900004],
        ["1:00", 3629999],
        ["1:00", 3630001], //There is no rounding for minutes
        ["1:01", 3660000],
        ["11:01", 39660000],
    ])("returns with", (result, timeInMillis) => {
        expect(toHoursAndMinutes(timeInMillis)).toStrictEqual(result);
    });
});
