import { v4 as uuid } from 'uuid'
import { IStateHandlerAsync } from './interface'
import { getValue, setValue } from '../../database'

const PersistentStateHandler = (function () {
    const hookID: string = uuid()

    let internalStorage: any
    let databaseBusy = false

    return async function useState(initialValue: any): Promise<IStateHandlerAsync> {
        internalStorage = initialValue

        // save stringified value to database
        if (typeof initialValue === 'object') {
            initialValue = JSON.stringify(initialValue)
        }
        initialValue = String(initialValue)
        await setValue(hookID, initialValue)

        async function set(updatedValue: any): Promise<void> {
            internalStorage = updatedValue
            databaseBusy = true

            if (typeof updatedValue === 'object') {
                updatedValue = JSON.stringify(updatedValue)
            }
            updatedValue = String(updatedValue)

            await setValue(hookID, updatedValue)
            databaseBusy = false
        }

        async function get(): Promise<any> {
            if (databaseBusy) {
                return internalStorage
            }

            // return last known defined value if database fetch failed
            const databaseResponse = await getValue(hookID)
            if (databaseResponse === undefined || databaseResponse === null) {
                return internalStorage
            }

            if (typeof internalStorage === 'object') {
                internalStorage = JSON.parse(databaseResponse)
                return internalStorage
            }

            return <typeof internalStorage>databaseResponse
        }

        return { get, set }
    }
})()

export { PersistentStateHandler }
