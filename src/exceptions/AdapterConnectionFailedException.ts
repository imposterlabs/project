import { DatabaseAdapterException } from "./DatabaseAdapterException"

export class AdapterConnectionFailedException extends DatabaseAdapterException {
    constructor(adapterName: string) {
        super(`[${adapterName}] : Connection Test Failed`)
    }
}
