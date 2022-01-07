class ParserException extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, ParserException.prototype);
    }
}