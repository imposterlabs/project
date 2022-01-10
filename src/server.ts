import { IMayaRouteDefinition } from "./parser/core/interface";
import { METHOD } from "./parser/core/method";
import { HttpWebServer } from "./processor/express"
import { repeat } from "./common/responseHelpers";

import { StateHandler } from "./state/StateHandler"
import { PersistentStateHandler } from "./state/PersistentStateHandler"
import { RetrieveOrphan, SaveAsOrphan } from "./state/Orphan"

const worker = async () => {

    const { get: getSimpleState, set: setSimpleState } = StateHandler<string>("default_value")
    const { get: getPersistentState, set: setPersistentState } = await PersistentStateHandler("default_value")

    const routeMaps: Array<IMayaRouteDefinition> = [
        {
            method: METHOD.GET,
            url: "/faker/:times",
            response: ({ faker, request: { params } }) => {
                const number = parseInt(params.times)
                const generatorFunction = () => ({
                    name: faker.name.findName(),
                    organization: faker.company.companyName(),
                    dateJoined: faker.date.past(10),
                    image: faker.image.people()
                })
                const data = repeat(generatorFunction, number)
                return data
            }
        },
        {
            method: METHOD.GET,
            url: "/state-handler",
            response: async () => {
                const data = getSimpleState()
                return { payload: data }
            }
        },
        {
            method: METHOD.POST,
            url: "/state-handler",
            response: async ({ request }) => {
                const value = request.body.value
                setSimpleState(value)
                return { payload: value }
            }
        },
        {
            method: METHOD.GET,
            url: "/persistent-state-handler",
            response: async () => {
                const data = await getPersistentState()
                return { payload: data }
            }
        },
        {
            method: METHOD.POST,
            url: "/persistent-state-handler",
            response: async ({ request }) => {
                const value = request.body.value
                await setPersistentState(value)
                return { payload: value }
            }
        },
        {
            method: METHOD.GET,
            url: "/orphan-state-handler/:key",
            response: async ({ request }) => {
                const key = request.params.key
                const data = await RetrieveOrphan(key)
                return { payload: data }
            }
        },
        {
            method: METHOD.POST,
            url: "/orphan-state-handler/:key",
            response: async ({ request }) => {
                const key = request.params.key
                const value = request.body.value
                await SaveAsOrphan(key, value)
                return { payload: value }
            }
        }
    ]

    const server = new HttpWebServer();
    server.registerRoutes(routeMaps);
    server.start()

}


worker()