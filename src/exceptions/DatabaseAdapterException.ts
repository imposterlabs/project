export class DatabaseAdapterException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, DatabaseAdapterException.prototype);
    }
}
