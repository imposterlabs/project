import { v4 as uuid } from 'uuid';
import { IStateHandler, IStateHandlerAsync } from "./interface"
import { RedisAdapter } from '../../database/redis';


const StateHandler = (function () {
    let internalStorage: any

    return function useState<Type>(initialValue: Type): IStateHandler<Type> {
        internalStorage = initialValue

        function set(updatedValue: Type): void {
            internalStorage = updatedValue
        }

        function get(): Type {
            return internalStorage
        }

        return { get, set }
    }
})()

const PersistentStateHandler = (function () {
    const hookID: string = uuid();
    const databaseHandler = new RedisAdapter({})

    let internalStorage: any
    let databaseBusy = false

    return async function useState(initialValue: any): Promise<IStateHandlerAsync> {
        internalStorage = initialValue

        // save stringified value to database
        if (typeof initialValue === "object") {
            initialValue = JSON.stringify(initialValue)
        }
        initialValue = String(initialValue)
        await databaseHandler.setValue(hookID, initialValue)

        async function set(updatedValue: any): Promise<void> {
            internalStorage = updatedValue
            databaseBusy = true

            if (typeof updatedValue === "object") {
                updatedValue = JSON.stringify(updatedValue)
            }
            updatedValue = String(updatedValue)

            await databaseHandler.setValue(hookID, updatedValue)
            databaseBusy = false
        }

        async function get(): Promise<any> {
            if (databaseBusy) {
                return internalStorage
            }

            // return last known defined value if database fetch failed
            const databaseResponse = await databaseHandler.getValue(hookID)
            if (databaseResponse === undefined) {
                return internalStorage
            }

            if (typeof internalStorage === "object") {
                internalStorage = JSON.parse(databaseResponse)
                return internalStorage
            }

            return <typeof internalStorage>databaseResponse
        }

        return { get, set }
    }
})()



export { StateHandler, PersistentStateHandler }