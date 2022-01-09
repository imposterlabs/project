import { DatabaseAdapterException } from "./DatabaseAdapterException"

export class KeyCannotBeSavedException extends DatabaseAdapterException {
    constructor(adapter: string, key: string, value: string) {
        super(`[${adapter}] : cannot save '${key}' with value '${value}'`)
    }
}
