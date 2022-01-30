import { BaseDatabaseAdapter } from '@sasta-sa/abstract-database-adapter'

let adapter: BaseDatabaseAdapter | undefined
let getValue: (key: string) => Promise<string | null> | string | null
let setValue: (key: string, value: string) => void
let closeConnection: () => void

const setAdapter = (adapterInstance: BaseDatabaseAdapter) => {
    adapter = adapterInstance
    getValue = adapter.getValueHandlerGenerator()
    setValue = adapter.setValueHandlerGenerator()
    closeConnection = adapter.close
}

export { getValue, setValue, closeConnection, setAdapter }
