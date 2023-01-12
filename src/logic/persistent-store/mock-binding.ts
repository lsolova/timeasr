import { TimeasrStoreBinding } from "../types";

export const MockBinding: TimeasrStoreBinding = {
    initializeDB: () => Promise.resolve(),
    getTimelogEntries: () => Promise.resolve([]),
    persistTimelogEntry: (entry) => Promise.resolve(entry.logId),
};
