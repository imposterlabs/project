import { IRepeatGenerator } from "./interface"

export function repeat<Type>(generator: IRepeatGenerator<Type>, times: number): Array<Type> {
    const returnData: Array<Type> = []

    for (let i = 0; i < times; i++) {
        returnData.push(generator())
    }

    return returnData
}