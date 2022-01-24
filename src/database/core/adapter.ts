import { BaseDatabaseAdapter } from ".";
import { MethodNotImplemented } from "../../common/utils";

let adapter: BaseDatabaseAdapter | undefined = MethodNotImplemented("adapter")
let getValue = MethodNotImplemented("getValue") as unknown as (key: string) => Promise<string | undefined>
let setValue = MethodNotImplemented("setValue") as unknown as (key: string, value: string) => void
let closeConnection = MethodNotImplemented("closeConnection") as unknown as () => void

const setAdapter = (adapterInstance: BaseDatabaseAdapter) => {
    adapter = adapterInstance
    getValue = adapter.getValue
    setValue = adapter.setValue
    closeConnection = adapter.close
}

const resetAdapter = () => {
    adapter = undefined
    getValue = MethodNotImplemented("getValue")
    setValue = MethodNotImplemented("setValue")
}

export { getValue, setValue, closeConnection, setAdapter, resetAdapter }
