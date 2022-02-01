import { HttpWebServer } from '../processor/express'
import { CommonBaseClass } from '../common/class'
import { BaseDatabaseAdapter } from '@sasta-sa/abstract-database-adapter'
import { IEnvironment, IMayaRouteDefinition, IMayaTriggerDefinition } from '../parser/core/interface'
import { ISastaProjectConfig } from './interface'
import { RequestHandler } from 'express'

class SastaSaProject extends CommonBaseClass {
    private _environment: IEnvironment
    private _httpServer: HttpWebServer

    constructor(config?: ISastaProjectConfig) {
        super('SastaSaProject')

        this._environment = {
            variation: config?.variation ?? 0,
            processingTime: config?.processingTime ?? 0,
            errorFraction: config?.errorFraction ?? 0.05,
            internalServerErrorRatio: config?.internalServerErrorRatio ?? 0.1,
            badRequestErrorRatio: config?.badRequestErrorRatio ?? 0.1,
            serviceUnavailableErrorRatio: config?.serviceUnavailableErrorRatio ?? 0.1,
            getENV: process.env,
        }

        this._httpServer = new HttpWebServer({
            environment: this._environment,
            port: config?.port ?? 3000,
        })
    }

    /**
     * HttpServer handlers
     */
    public startServer() {
        this._httpServer.start()
    }

    public registerRoutes(routes: Array<IMayaRouteDefinition>) {
        this._httpServer.registerRoutes(routes)
    }

    public registerTriggers(triggers: Array<IMayaTriggerDefinition>) {
        this._httpServer.registerTriggers(triggers)
    }

    public attachDatabase(databaseInstance: BaseDatabaseAdapter) {
        this._httpServer.attachDatabase(databaseInstance)
    }

    public attachMiddleware(middleware: RequestHandler) {
        this._httpServer.attachMiddleware(middleware)
    }
}

export { SastaSaProject }
