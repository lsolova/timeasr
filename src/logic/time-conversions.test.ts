import { asDay, asMonth, dayEnd, dayStart } from "./time-conversions";

describe("Time conversions", () => {
    it("asDay() returns the string representation of the milliseconds", () => {
        expect(asDay(1664806686649)).toStrictEqual("20221003");
    });
    it("asMonth() returns the string representation of the milliseconds", () => {
        expect(asMonth(1664806686649)).toStrictEqual("202210");
    });
    it("dayEnd() returns with last UTC millisecond for that day", () => {
        expect(dayEnd(1664806686649)).toStrictEqual(1664841599999);
    });
    it("dayStart() returns with first UTC millisecond for that day", () => {
        expect(dayStart(1664806686649)).toStrictEqual(1664755200000);
    });
});
