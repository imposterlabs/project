export class ProcessorException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, ProcessorException.prototype);
    }
}
