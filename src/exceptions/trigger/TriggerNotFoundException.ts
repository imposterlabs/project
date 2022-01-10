import { TriggerException } from "./TriggerException"

export class TriggerNotFoundException extends TriggerException {
    constructor(triggerName: string) {
        super(`'${triggerName}' could not be resolved`)
    }
}

