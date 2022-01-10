import { IMayaRouteDefinition, IMayaTriggerDefinition } from "./parser/core/interface";
import { METHOD } from "./parser/core/method";
import { HttpWebServer } from "./processor/express"
import { repeat } from "./common/responseHelpers";

import { StateHandler } from "./state/StateHandler"
import { PersistentStateHandler } from "./state/PersistentStateHandler"
import { RetrieveOrphan, SaveAsOrphan } from "./state/Orphan"

const worker = async () => {

    const { get: getSimpleState, set: setSimpleState } = StateHandler<string>("default_value")
    const { get: getPersistentState, set: setPersistentState } = await PersistentStateHandler("default_value")

    const triggerMaps: Array<IMayaTriggerDefinition> = [
        {
            name: "TRIGGER_BEFORE_1",
            method: METHOD.GET,
            url: "https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb",
            response: async () => {
                console.log("TRIGGER_BEFORE")
            }
        },
        {
            name: "TRIGGER_BEFORE_2",
            method: METHOD.POST,
            url: "https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb",
            response: async () => {
                console.log("TRIGGER_BEFORE")
            },
            body: {
                "name": "TRIGGER_BEFORE_2"
            }
        },
        {
            name: "TRIGGER_AFTER_1",
            method: METHOD.GET,
            url: "https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb",
            response: async () => {
                console.log("TRIGGER_AFTER")
            }
        },
        {
            name: "TRIGGER_AFTER_2",
            method: METHOD.POST,
            url: "https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb",
            response: async () => {
                console.log("TRIGGER_AFTER")
            },
            body: {
                "name": "TRIGGER_AFTER_2"
            }
        },

    ]

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
            },
            before: ["TRIGGER_BEFORE_1", "TRIGGER_BEFORE_2"],
            after: ["TRIGGER_AFTER_1", "TRIGGER_AFTER_2"]
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
    server.registerTriggers(triggerMaps)
    server.registerRoutes(routeMaps);
    server.start()

}


worker()