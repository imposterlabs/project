class NotImplementedException extends ParserException {
    constructor(message: string) {
        super(message)

        Object.setPrototypeOf(this, NotImplementedException.prototype);
    }
}
