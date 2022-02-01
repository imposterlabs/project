export interface ISastaProjectConfig {
    /** The default error rate of all operations. If specific overrides are not defined, then this value is used. */
    errorFraction?: number

    /** variation in values defined at initialization, default is 0, every thing happens as defined */
    variation?: number

    /** the default processing time for all operations (routes/triggers)  */
    processingTime?: number

    /** HttpResponseRatios */
    internalServerErrorRatio?: number
    badRequestErrorRatio?: number
    serviceUnavailableErrorRatio?: number

    port: number
}
