export class MethodNotImplementedException extends Error {
    constructor(message: string) {
        super(`${message} is not implemented. Have you attached all the required adapters?`);

        Object.setPrototypeOf(this, MethodNotImplementedException.prototype);
    }
}
