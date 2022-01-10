import { createClient, RedisClientType } from "redis"
import { AdapterConnectionFailedException } from "../../exceptions/AdapterConnectionFailedException"
import { BaseDatabaseAdapter } from "../core"
import { IBaseDatabaseAdapter } from "../core/interface"
import { IRedisDatabaseAdapter } from "./interface"


class RedisAdapter extends BaseDatabaseAdapter {
    protected _client: RedisClientType<any>

    constructor(config: IRedisDatabaseAdapter) {
        const { connectionString } = config
        const baseAdapterConfig: IBaseDatabaseAdapter = {
            databaseType: "redis",
            name: "redis",
            connectionString: connectionString || "redis://localhost:6379"
        }
        super(baseAdapterConfig)

        this._client = createClient({ url: this._connectionString })
        this._client.connect()
        this._testConnection()
    }

    /** Operations to perform on the client when the adapter is initialized */
    public async _initialize(): Promise<void> {
        const timeStamp = new Date().getTime()
        this.setValue("initialized", `${timeStamp}`)
    }

    /** Test the connection to the database by saving and retrieving a value */
    public async _testConnection(): Promise<void> {
        const pingResponse = await this._client.ping()
        if (pingResponse !== "PONG") {
            throw new AdapterConnectionFailedException(this._name)
        }

        this._log("connection successful")
    }

    public async getValue(key: string): Promise<string | undefined> {
        const operation = await this._client.get(key)

        if (operation === null) {
            this._keyNotFoundHandler(key)
            return undefined
        }

        return operation
    }

    public async setValue<Type>(key: string, value: string): Promise<void> {
        const operation = await this._client.set(key, value, { EX: 30 })

        if (operation !== "OK") {
            this._keyCannotBeSavedHandler(key, value)
        }
    }

    public async close(): Promise<void> {
        this._client.quit()
    }
}

export { RedisAdapter }