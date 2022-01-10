import express from "express"
import bodyParser from "body-parser"
import { IEnvironment, IMayaRouteDefinition } from "../parser/core/interface";
import { CommonBaseClass } from "../common/class"
import { MayaRouteProcessor } from "./routeProcessor";

class HttpWebServer extends CommonBaseClass {

    private _app: express.Application;
    private _port: number = 3000
    private _environment: IEnvironment

    constructor() {
        super("HttpWebServer")

        this._app = express();
        this._app.use(bodyParser.urlencoded({ extended: true }))
        this._app.get("/", (req, res) => { return res.json({ alive: true }) })

        this._environment = {}
    }

    public start() {
        this._app.listen(this._port)
        this.__logInfo(`Server started on http://localhost:${this._port}`)
    }

    public registerRoutes(routes: Array<IMayaRouteDefinition>) {
        routes.forEach(route => {
            this._processesAndRegisterRoute(route)
        })
    }

    private async _processesAndRegisterRoute(route: IMayaRouteDefinition) {
        const routeProcessor = new MayaRouteProcessor(route)
        const processedRoute = await routeProcessor.process()

        const requestMethod = <keyof express.Application><unknown>route.method.name

        this._app[requestMethod](route.url,
            async (request: express.Request, res: express.Response) => {
                const programmedResponse = await route.response({
                    environment: processedRoute.environment,
                    prompt: processedRoute.prompt,
                    request
                })

                return res.json(programmedResponse)
            }
        )
    }
}

export { HttpWebServer }