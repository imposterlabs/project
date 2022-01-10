import { IMayaRouteDefinition } from "./parser/core/interface";
import { METHOD } from "./parser/core/method";
import { HttpWebServer } from "./processor/express"

const routeMaps: Array<IMayaRouteDefinition> = [
    {
        method: METHOD.GET,
        url: "/hello",
        response: () => {
            return { message: "hello world" }
        }
    }
]

const server = new HttpWebServer();
server.registerRoutes(routeMaps);
server.start()
