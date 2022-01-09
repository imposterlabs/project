export interface IBaseDatabaseAdapter {
    name: string;
    databaseType: string;
    connectionString: string;

    suppressWarnings?: boolean;
    raiseExceptionOnWarning?: boolean;
}

