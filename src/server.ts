import { IMayaRouteDefinition, IMayaTriggerDefinition } from './parser/core/interface'
import { METHOD } from './parser/core/method'
import { HttpWebServer } from './processor/express'
import { repeat } from './common/responseHelpers'

import { StateHandler } from './state/StateHandler'
import { PersistentStateHandler } from './state/PersistentStateHandler'
import { RetrieveOrphan, SaveAsOrphan } from './state/Orphan'

import { InMemoryAdapter } from '@sasta-sa/in-memory-database-adapter'

const worker = async () => {
    const server = new HttpWebServer()
    const databaseHandler = new InMemoryAdapter()
    server.attachDatabase(databaseHandler)

    const { get: getSimpleState, set: setSimpleState } = new StateHandler<string>('default_value').getPair()
    const { get: getPersistentState, set: setPersistentState } = await PersistentStateHandler('default_value')

    const triggerMaps: Array<IMayaTriggerDefinition> = [
        {
            name: 'TRIGGER_1',
            method: METHOD.GET,
            url: 'https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb',
            response: async () => {
                console.log('TRIGGER 1')
            },
            before: ['TRIGGER_1_BEFORE'],
            after: ['TRIGGER_1_AFTER'],
        },
        {
            name: 'TRIGGER_1_BEFORE',
            method: METHOD.GET,
            url: 'https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb',
            response: async () => {
                console.log('TRIGGER 1 BEFORE')
            },
        },
        {
            name: 'TRIGGER_1_AFTER',
            method: METHOD.GET,
            url: 'https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb',
            response: async () => {
                console.log('TRIGGER 1 AFTER')
            },
        },
        {
            name: 'TRIGGER_2',
            method: METHOD.GET,
            url: 'https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb',
            response: async () => {
                console.log('TRIGGER 2')
            },
            before: ['TRIGGER_2_BEFORE'],
            after: ['TRIGGER_2_AFTER'],
        },
        {
            name: 'TRIGGER_2_BEFORE',
            method: METHOD.GET,
            url: 'https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb',
            response: async () => {
                console.log('TRIGGER 2 BEFORE')
            },
        },
        {
            name: 'TRIGGER_2_AFTER',
            method: METHOD.GET,
            url: 'https://webhook.site/b0ae265d-839f-45fa-9774-c2d8bed11ddb',
            response: async () => {
                console.log('TRIGGER 2 AFTER')
            },
        },
    ]

    const routeMaps: Array<IMayaRouteDefinition> = [
        {
            method: METHOD.GET,
            url: '/faker/:times',
            response: ({ faker, request: { params } }) => {
                const number = parseInt(params.times)
                const generatorFunction = () => ({
                    name: faker.name.findName(),
                    organization: faker.company.companyName(),
                    dateJoined: faker.date.past(10),
                    image: faker.image.people(),
                })
                const data = repeat(generatorFunction, number)
                return data
            },
            before: ['TRIGGER_1'],
            after: ['TRIGGER_2'],
        },
        {
            method: METHOD.GET,
            url: '/state-handler',
            response: async () => {
                const data = getSimpleState()
                return { payload: data }
            },
        },
        {
            method: METHOD.POST,
            url: '/state-handler',
            response: async ({ request }) => {
                const value = request.body.value
                setSimpleState(value)
                return { payload: value }
            },
        },
        {
            method: METHOD.GET,
            url: '/persistent-state-handler',
            response: async () => {
                const data = await getPersistentState()
                return { payload: data }
            },
        },
        {
            method: METHOD.POST,
            url: '/persistent-state-handler',
            response: async ({ request }) => {
                const value = request.body.value
                await setPersistentState(value)
                return { payload: value }
            },
        },
        {
            method: METHOD.GET,
            url: '/orphan-state-handler/:key',
            response: async ({ request }) => {
                const key = request.params.key
                const data = await RetrieveOrphan(key)
                return { payload: data }
            },
        },
        {
            method: METHOD.POST,
            url: '/orphan-state-handler/:key',
            response: async ({ request }) => {
                const key = request.params.key
                const value = request.body.value
                await SaveAsOrphan(key, value)
                return { payload: value }
            },
        },
    ]

    server.registerTriggers(triggerMaps)
    server.registerRoutes(routeMaps)
    server.start()
}

worker()
