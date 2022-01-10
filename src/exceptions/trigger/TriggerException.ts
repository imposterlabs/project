class TriggerException extends Error {
    constructor(message: string) {
        super(`[trigger] : ${message}`);

        Object.setPrototypeOf(this, TriggerException.prototype);
    }
}

export { TriggerException }