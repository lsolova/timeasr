import "./indexed-db";
import { DatabaseConfiguration, QueryParams, RunQueryFn } from "./types";

let databaseConfig: DatabaseConfiguration;
let runQueryFn: RunQueryFn<unknown, unknown>;

const runQuery = <Data, Result>(query: QueryParams<Data, Result>) => {
    if (typeof runQueryFn === "function") {
        return runQueryFn(query);
    } else {
        return []; // By default an empty array is returning
    }
};

jest.mock("./indexed-db", () => ({
    IndexedDb: {
        init: (config: DatabaseConfiguration) => {
            databaseConfig = config;
            Promise.resolve();
        },
        runQuery,
    },
}));

export const IndexedDbMocker = {
    getDatabaseConfig: () => databaseConfig,
    setRunQueryFn: <Data, Result>(fn: RunQueryFn<Data, Result>) => {
        runQueryFn = fn;
    },
    reset: () => {
        databaseConfig = undefined;
        runQueryFn = undefined;
    },
};
