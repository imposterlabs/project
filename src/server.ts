import { METHOD } from "./parser/core/method/index"
import { MayaTriggerProcessor } from "./processor"
import { StateHandler } from "./state/useState"


const { get: getCounter, set: setCounter } = StateHandler<number>(10)
console.log(getCounter())

setCounter(200)

console.log(getCounter())
