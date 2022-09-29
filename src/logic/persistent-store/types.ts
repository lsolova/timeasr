type IndexConfiguration = {
    indexName: string;
    indexPath: string;
    unique: boolean;
};
type TableConfiguration = {
    tableName: string;
    keyPath: string;
    autoIncrement: boolean;
    indexes?: IndexConfiguration[];
};
export type DatabaseConfiguration = {
    dbName: string;
    dbVersion: number;
    tables: TableConfiguration[];
};
export type DatabaseQueryFn<Data, Result> = {
    (trx: IDBTransaction, data: Data): Promise<Result>;
};
export type QueryParams<Data, Result> = {
    data: Data;
    objectStore: string;
    writable: boolean;
    queryFunction: DatabaseQueryFn<Data, Result>;
};
export type RunQueryFn<Data, Result> = {
    (params: QueryParams<Data, Result>): Promise<Result>;
};
