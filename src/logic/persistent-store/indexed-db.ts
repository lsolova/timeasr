import { DatabaseConfiguration, QueryParams } from "./types";

let dbConfig: DatabaseConfiguration;
let dbOpenPromise: Promise<IDBDatabase>;

const openDb = (): Promise<IDBDatabase> => {
    dbOpenPromise =
        dbOpenPromise ||
        new Promise((resolve, reject) => {
            const request = indexedDB.open(dbConfig.dbName, dbConfig.dbVersion);

            request.addEventListener("upgradeneeded", function doOnUpgrade() {
                const db = request.result;

                if (dbConfig.tables) {
                    dbConfig.tables.forEach((tableDescription) => {
                        const currentStore = db.createObjectStore(tableDescription.tableName, {
                            keyPath: tableDescription.keyPath,
                            autoIncrement: tableDescription.autoIncrement,
                        });
                        if (tableDescription.indices) {
                            tableDescription.indices.forEach(({ indexName, indexPath, unique = false }) =>
                                currentStore.createIndex(indexName, indexPath, { unique: unique })
                            );
                        }
                    });
                }
            });

            request.addEventListener("success", function () {
                resolve(request.result);
            });

            request.addEventListener("error", function () {
                reject(request.error);
            });
        });
    return dbOpenPromise;
};
const init = (conf: DatabaseConfiguration) => {
    dbConfig = { ...conf };
};
const runQuery = <Data, Result>({
    data,
    objectStore,
    writable,
    queryFunction,
}: QueryParams<Data, Result>): Promise<Result> => {
    return openDb().then((openedDB) => {
        const trx = openedDB.transaction(objectStore, writable ? "readwrite" : "readonly");
        return queryFunction.call(null, trx, data);
    });
};
const deleteDb = (): Promise<boolean> => {
    const deletePromise = new Promise<boolean>((resolve, reject) => {
        const deleteResult = indexedDB.deleteDatabase(dbConfig.dbName);
        deleteResult.onsuccess = () => {
            resolve(true);
        };
        deleteResult.onerror = () => {
            reject(deleteResult.error);
        };
        deleteResult.onblocked = () => {
            openDb().then((openedDB) => {
                openedDB.close();
            });
        };
    });
    return deletePromise;
};

export const IndexedDb = {
    deleteDb,
    init,
    runQuery,
};
