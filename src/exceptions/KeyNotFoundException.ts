import { DatabaseAdapterException } from "./DatabaseAdapterException"

export class KeyNotFoundException extends DatabaseAdapterException {
    constructor(adapter: string, key: string) {
        super(`[${adapter}] : ${key} not found`)
    }
}
