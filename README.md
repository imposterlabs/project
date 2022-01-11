# Maya MVP

> mock APIs, intelligently, with context, and perform other stuff as well :smile:

## Setting up
- Clone the project `git clone https://github.com/YashKumarVerma/maya-mvp` and `cd maya-mvp` to open it
- Instal the dependencies with `npm i`
- Start development server with `nodemon`

## Triggers
Triggers are like functions, which are called by other triggers([*upcoming feature*](https://github.com/YashKumarVerma/maya-mvp/issues/16)) or routes. The main aim is to perform database operations / network calls before/after the route has been executed.

## Routes
Routes are what routes are. Set a method, a url, and a response handler. Each response handler has context about the application (*check interfaces or `src/server.ts` for examples*). Also supports `faker.js` as generator of fake data.

## State 
An important part of writing a responsive mock server is state management. A total of three state handlers are provided by the application.
  
### `StateHandler`
```ts
import { StateHandler } from "./state/StateHandler"

const { get: getSimpleState, set: setSimpleState } = StateHandler<string>("default_value")
```
- the data is kept in memory, not on database.
- fastest of the three options.
- strong support for custom data types.

### `PersistentStateHandler`
```ts
import { PersistentStateHandler } from "./state/PersistentStateHandler"

const { get: getPersistentState, set: setPersistentState } = await PersistentStateHandler("default_value")
```
- the data kept in memory as well as database.
- slower than `StateHandler`, but persists the data in the database.
- `get` and `set` are twin functions, which operate on the same data source.

### `Orphan`
```ts
import { RetrieveOrphan, SaveAsOrphan } from "./state/Orphan"

await SaveAsOrphan(key, value)
const data = await RetrieveOrphan(key)
```
- the data is kept in database only.
- slower than others.
- **main advantage** : `get` and `set` are completely independent functions, useful when you want to define the object maps across different files or love a clean architecture.

## Sample File
```ts
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
```

## Testing
It is recommended to use a service like [webhook.site](https://webhook.site/) to inspect the requests.