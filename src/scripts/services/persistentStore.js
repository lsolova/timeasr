const dbStores = [];

let dbConfig;
let dbOpenPromise;

function openDb() {
    dbOpenPromise = dbOpenPromise || new Promise((resolve, reject) => {
        const request = indexedDB.open(dbConfig.dbname, dbConfig.dbversion);

        request.onupgradeneeded = function doOnUpgrade(event) {
            const db = event.target.result;

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
                    dbStores[tableDescription.tableName, currentStore];
                });
            }
        };

        request.onsuccess = function (event) {
            resolve(event.target.result);
        };

        request.onerror = function (event) {
            reject(event.target.error);
        };
    });
    return dbOpenPromise;
}

function openTransaction(openedDB, objectStore, writable) {
    let trx;
    if (writable) {
        trx = openedDB.transaction(objectStore, 'readwrite');
    } else {
        trx = openedDB.transaction(objectStore, 'readonly');
    }
    return trx;
}

export function init(conf) {
    dbConfig = Object.assign({}, conf);
}

export function runQuery({data, objectStore, writable, queryFunction}) {
    return openDb()
        .then((openedDB) => {
            const trx = openTransaction(openedDB, objectStore, writable);
            return queryFunction.call(null, trx, data);
        });
    }

export function deleteDb() {
    const deletePromise = new Promise((resolve, reject) => {
        const deleteResult = indexedDB.deleteDatabase(dbConfig.dbname);
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
