import { CommonBaseClass } from "../../common/class"
import { KeyCannotBeSavedException } from "../../exceptions/KeyCannotBeSavedException"
import { KeyNotFoundException } from "../../exceptions/KeyNotFoundException"
import { IBaseDatabaseAdapter } from "./interface"

abstract class BaseDatabaseAdapter extends CommonBaseClass {

    protected _name: string
    protected _databaseType: string
    protected _connectionString: string

    // configurations
    protected _suppressWarnings: boolean = false
    protected _raiseExceptionOnWarning: boolean = false

    constructor(config: IBaseDatabaseAdapter) {
        super(config.name)
        const { name, databaseType, connectionString } = config

        this._name = name
        this._databaseType = databaseType
        this._connectionString = connectionString

        // configuration defaults
        this._suppressWarnings = config.suppressWarnings || false
        this._raiseExceptionOnWarning = config.raiseExceptionOnWarning || false

    }

    public abstract _initialize(): Promise<void>
    public abstract _testConnection(): Promise<void>
    public abstract setValue(key: string, value: string): void
    public abstract getValue(key: string): Promise<string | undefined>
    public abstract close(): void

    protected _keyNotFoundHandler(key: string): void {
        this.__logWarn(`key '${key}' not found, returning undefined`)

        if (this._raiseExceptionOnWarning) {
            throw new KeyNotFoundException(this._name, key)
        }
    }

    protected _keyCannotBeSavedHandler(key: string, value: string): void {
        this.__logWarn(`key '${key}' could not be saved with value '${value}'`)

        if (this._raiseExceptionOnWarning) {
            throw new KeyCannotBeSavedException(this._name, key, value)
        }
    }

}

export { BaseDatabaseAdapter }
