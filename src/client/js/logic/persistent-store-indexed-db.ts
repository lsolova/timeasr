interface IndexConfiguration {
    indexName: string;
    indexPath: string;
    unique: boolean;
}

interface TableConfiguration {
    tableName: string;
    keyPath: string;
    autoIncrement: boolean;
    indexes: IndexConfiguration[];
}

export interface DatabaseConfiguration {
    dbName: string;
    dbVersion: number;
    tables: TableConfiguration[];
}

interface DatabaseQueryFn<Data, Result> {
    (trx: IDBTransaction, data: Data): Promise<Result>;
}

let dbConfig: DatabaseConfiguration;
let dbOpenPromise: Promise<IDBDatabase>;

function openDb(): Promise<IDBDatabase> {
    dbOpenPromise = dbOpenPromise || new Promise((resolve, reject) => {
        const request = indexedDB.open(dbConfig.dbName, dbConfig.dbVersion);

        request.onupgradeneeded = function doOnUpgrade(event: IDBVersionChangeEvent) {
            const db = request.result;

            if (dbConfig.tables) {
                dbConfig.tables.forEach((tableDescription) => {
                    const currentStore = db.createObjectStore(
                        tableDescription.tableName,
                        {
                            keyPath: tableDescription.keyPath,
                            autoIncrement: tableDescription.autoIncrement
                        }
                    );
                    if (tableDescription.indexes) {
                        tableDescription.indexes.forEach(
                            ({indexName, indexPath, unique = false}) => currentStore.createIndex(
                                indexName,
                                indexPath,
                                {unique: unique}
                            )
                        );
                    }
                });
            }
        };

        request.onsuccess = function () {
            resolve(request.result);
        };

        request.onerror = function () {
            reject(request.error);
        };
    });
    return dbOpenPromise;
}

export function init(conf: DatabaseConfiguration) {
    dbConfig = Object.assign({}, conf);
}

export function runQuery<Data, Result>({data, objectStore, writable, queryFunction}: {data: Data, objectStore: string, writable: boolean, queryFunction: DatabaseQueryFn<Data, Result>}): Promise<Result> {
    return openDb()
        .then((openedDB) => {
            const trx = openedDB.transaction(objectStore, writable ? 'readwrite' : 'readonly');
            return queryFunction.call(null, trx, data);
        });
    }

export function deleteDb(): Promise<boolean> {
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
        }
    });
    return deletePromise;
}
