import { CurrentTime } from "./current-time";
import * as BrowserWrapper from "./browser-wrapper";
import { Milliseconds } from "../types";

describe("Current time handler", () => {
    beforeEach(() => {
        jest.spyOn(BrowserWrapper, "now").mockImplementation(() => 1683024889501);
    });
    test.each<{ useCase: string; input: string; expected: Milliseconds }>([
        {
            useCase: "wrong formatted time - unaccepted character",
            input: "1,214",
            expected: 1683024889501,
        },
        {
            useCase: "wrong formatted time - wrong syntax",
            input: "1:214",
            expected: 1683024889501,
        },
        {
            useCase: "wrong formatted time - too less digits",
            input: "94",
            expected: 1683024889501,
        },
        {
            useCase: "wrong formatted time - out ouf bound hours",
            input: "24:14",
            expected: 1683024889501,
        },
        {
            useCase: "well formatted time - day start",
            input: "0:00",
            expected: 1682978400000,
        },
        {
            useCase: "well formatted time - some time",
            input: "11:14",
            expected: 1683018840000,
        },
        {
            useCase: "well formatted time - day end",
            input: "23:59",
            expected: 1683064740000,
        },
        {
            useCase: "short formatted time with 4 digits",
            input: "1114",
            expected: 1683018840000,
        },
        {
            useCase: "short formatted time with 3 digits",
            input: "914",
            expected: 1683011640000,
        },
    ])("sets the proper value to the new time - $useCase", ({ input, expected }) => {
        CurrentTime.set(input);
        expect(CurrentTime.get()).toStrictEqual(expected);
    });
});
