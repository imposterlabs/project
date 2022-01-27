import { IStateHandler, } from "./interface"

class StateHandler<DefaultValueType> {
    public value: DefaultValueType

    constructor(defaultValue: DefaultValueType) {
        this.value = defaultValue
    }

    get(): any {
        return this.value
    }

    set(value: any): void {
        this.value = value
    }

    getPair(): IStateHandler<DefaultValueType> {
        return {
            get: this.get.bind(this),
            set: this.set.bind(this),
        }
    }
}


export { StateHandler }
