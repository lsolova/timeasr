const dbStores = [];

let dbConfig;
let dbOpenPromise;

function openDb() {
    dbOpenPromise = dbOpenPromise || new Promise((resolve, reject) => {
        const request = indexedDB.open(dbConfig.dbname, dbConfig.dbversion);

        request.onupgradeneeded = function doOnUpgrade() {
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
                    dbStores[tableDescription.tableName, currentStore];
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

function openTransaction(openedDB, objectStore, writable) {
    const trxPromise = new Promise((resolve) => {
        let trx;
        if (writable) {
            trx = openedDB.transaction(objectStore, 'readwrite');
        } else {
            trx = openedDB.transaction(objectStore);
        }
        resolve(trx);
    });
    return trxPromise;
}

export function init(conf) {
    dbConfig = Object.assign({}, conf);
}

export function runQuery({data, objectStore, writable, queryFunction}) {
    return openDb()
        .then((openedDB) => {
            return openTransaction(openedDB, objectStore, writable);
        })
        .then((trx) => {
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
