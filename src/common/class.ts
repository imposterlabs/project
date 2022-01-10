import { logger } from "./logger"

abstract class CommonBaseClass {
    private __className: string;
    private logger = logger;

    constructor(className: string) {
        this.__className = className;
    }

    protected __logInfo(message: string) {
        this.logger.info(`[${this.__className}]: ${message}`);
    }

    protected __logError(message: string) {
        this.logger.error(`[${this.__className}]: ${message}`);
    }

    protected __logDebug(message: string) {
        this.logger.debug(`[${this.__className}]: ${message}`);
    }

    protected __logWarn(message: string) {
        this.logger.warn(`[${this.__className}]: ${message}`);
    }
}


export { CommonBaseClass }