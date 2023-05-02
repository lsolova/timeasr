import { toDayTime, toHoursAndMinutes } from "./time-formatters";

describe("Time formatters", () => {
    test.each<{ result: string; timeInMillis: number }>([
        { result: "-1:18", timeInMillis: -4680000 },
        { result: "-0:27", timeInMillis: -1620000 },
        { result: "1:12", timeInMillis: 4320000 },
        { result: "0:02", timeInMillis: 120000 },
    ])("toHoursAndMinutes() returns $result if input is $timeInMillis", ({ result, timeInMillis }) => {
        expect(toHoursAndMinutes(timeInMillis)).toStrictEqual(result);
    });
    test.each<{ result: string; timeInMillis: number }>([
        { result: "0:00", timeInMillis: 1675036800000 },
        { result: "2:11", timeInMillis: 1675044660000 },
        { result: "23:59", timeInMillis: 1675123140000 },
    ])("toDayTime() returns $result if input is $timeInMillis", ({ result, timeInMillis }) => {
        const offset = new Date(timeInMillis).getTimezoneOffset();
        expect(toDayTime(timeInMillis + offset * 60000)).toStrictEqual(result);
    });
});
