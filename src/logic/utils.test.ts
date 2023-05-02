import { parseEnteredTime } from "./utils";

describe("Logic utils", () => {
    test("parseEnteredTime() returns", () => {
        expect(parseEnteredTime("11:14")).toStrictEqual({
            hours: 11,
            minutes: 14,
        });
    });
});
