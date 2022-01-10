import winston from 'winston'

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.simple(),
        winston.format.colorize(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true }),
    )
})

if (process.env.node_env !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    )
}

export { logger }