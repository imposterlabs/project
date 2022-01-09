import { ProcessorException } from "./ProcessorException"

export class ContextualFunctionException extends ProcessorException {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, ContextualFunctionException.prototype);
    }
}
