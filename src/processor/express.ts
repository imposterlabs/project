import express from 'express'
import faker from 'faker/locale/en_IND'

/** server middleware */
import bodyParser from 'body-parser'
import cors from 'cors'

/** type definitions */
import { IEnvironment, IMayaRouteDefinition, IMayaTriggerDefinition } from '../parser/core/interface'
import { IHttpWebServerConstructor } from './interface'

/** methods and classes */
import { CommonBaseClass } from '../common/class'
import { MayaRouteProcessor } from './routeProcessor'
import { TriggerNotFoundException } from '../exceptions/trigger'
import { MayaTriggerProcessor } from '.'
import { BaseDatabaseAdapter } from '../database/core'

class HttpWebServer extends CommonBaseClass {
    private _app: express.Application
    private _port: number
    private _environment: IEnvironment
    private _triggers: Array<IMayaTriggerDefinition> = []
    private _database: BaseDatabaseAdapter | undefined
    private _config: IHttpWebServerConstructor

    constructor(config: IHttpWebServerConstructor) {
        super('HttpWebServer')

        this._config = config
        this._port = config.port
        this._environment = config.environment

        /** setup express instance */
        this._app = express()
        this._app.use(bodyParser.urlencoded({ extended: true }))
        this._app.use(bodyParser.json())
        this._conditionallyAttachMiddleware()
        this._app.get('/status', (req, res) => {
            return res.json({ alive: true })
        })
        this._database = undefined
    }

    /**
     * all default middleware attachments are conditional, and can be disabled by passing false to the config.
     */
    private _conditionallyAttachMiddleware() {
        if (this._config.enableCORS ?? true) {
            this.attachMiddleware(cors())
        }
    }

    public start() {
        this._app.listen(this._port)
        this.__logInfo(`Server started on http://localhost:${this._port}`)
    }

    public registerRoutes(routes: Array<IMayaRouteDefinition>) {
        routes.forEach((route) => {
            this._processesAndRegisterRoute(route)
        })
    }

    public registerTriggers(triggers: Array<IMayaTriggerDefinition>) {
        this._triggers = triggers
    }

    public attachDatabase(databaseInstance: BaseDatabaseAdapter) {
        this._database = databaseInstance
        this._database.testConnection()
        this._database._initialize()
    }

    public attachMiddleware(middleware: express.RequestHandler) {
        this._app.use(middleware)
    }

    /**
     * helper functions for route and trigger processing
     */
    private async _processesAndRegisterRoute(route: IMayaRouteDefinition) {
        const routeProcessor = new MayaRouteProcessor(route)
        const processedRoute = await routeProcessor.process()
        processedRoute.environment = this._environment

        route = processedRoute.route
        const requestMethod = <keyof express.Application>(<unknown>route.method.name)

        // register route handler
        this._app[requestMethod](route.url, async (req: express.Request, res: express.Response) => {
            // run triggers before route
            if (route.before) {
                route.before.forEach((triggerName) => {
                    this._runTrigger(this._getTriggerByName(triggerName))
                })
            }

            // run route
            let response = route.response
            if (route.response instanceof Function) {
                response = await route.response({
                    environment: processedRoute.environment,
                    prompt: processedRoute.prompt,
                    request: req,
                    faker,
                })
            }

            // run triggers after route
            if (route.after) {
                route.after.forEach((triggerName) => {
                    this._runTrigger(this._getTriggerByName(triggerName))
                })
            }

            return res.json(response)
        })
    }

    private _getTriggerByName(triggerName: string): IMayaTriggerDefinition {
        const trigger = this._triggers.find((trigger) => trigger.name === triggerName)
        if (!trigger) {
            throw new TriggerNotFoundException(triggerName)
        }
        return trigger
    }

    private async _runTrigger(trigger: IMayaTriggerDefinition) {
        trigger.environment = this._environment
        const triggerHandler = new MayaTriggerProcessor(trigger)
        const { before, after } = triggerHandler.getPreAndPostTriggers()

        before.forEach((triggerName) => {
            const triggerInstance = this._getTriggerByName(triggerName)
            this._runTrigger(triggerInstance)
        })

        triggerHandler.run()

        after.forEach((triggerName) => {
            const triggerInstance = this._getTriggerByName(triggerName)
            this._runTrigger(triggerInstance)
        })
    }
}

export { HttpWebServer }
