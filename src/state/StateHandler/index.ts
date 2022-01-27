import { IStateHandler, } from "./interface"

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

export { StateHandler }
