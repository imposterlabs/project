# @imposterlabs/project

> mock APIs, intelligently, with context, and perform other stuff as well :smile:

## I'm here to mock, how do i do it?
- Refer the [example](git@github.com:imposterlabs/example.git) repository for examples. 


## How to use this in <5 minutes
Here's what you can do right now, and what you'd be able to do in near future:

**Terminology**
- **`Route`**  is a route. period. Each route is defined as an object.
- **`RouteMap`** is a list/array of routes that your server will answer to. Its a list of `route`  
- **`Triggers`** : is somewhat like a function. This name is borrowed from databases. Triggers can be called from `routes` and other `triggers`. Both before and after. 
- **`StateHandlers`** : this name is borrowed from react. StateHandlers are used to fetch or set data from `storages` -- used to make the mock server stateful. Use it to save details. Scroll for more details.


**Coming Soon**
- if a route in unhandled, forward the request to an external server. (inimplemented)
- Realtime Interrupts: (partially implemented)
  - define inputs that will be taken from CLI for route(implemented)
  - this input will have a default value, which will be used when running in headless mode.
  - these prompts are exposed to each route handler, and can be used to generate dynamic responses -- or launch triggers.
  - usecases: 
    - test specific cases against a mock without coding anything.
    - live debugging, allows hitting corner cases.
- Entropy Events: (partially implemented)
  - things break all the time. anyone can write code that works, but only a few can write code that doesn't break.
  - define an entropy value per server, which will be used to randomly break the server
  - these exceptions will return a wide range of HTTP status codes, each configurable (comes with ~~default~~ batteries included)
  - If an endpoint was written by an intern and breaks more than others, congrats. All configurations can be overriden per route level as well.



## Triggers
Triggers are like functions, which are called by other triggers or routes. The main aim is to perform database operations / network calls before/after the route has been executed. Use them to run tasks after something happened. 

**Example usage**
1. Banking
   - you make a request to the bank to collect money via UPI, bank returns OK, accepted, and starts processing. 
   - other user can take upto 15 minutes to accept/decline the UPI request
   - bank send back a webhook to your server whether the operation was successful or not.
   - the webhook is a **`trigger`**, which runs **`after`** your **`route`** sends `OK`

**Anatomy of triggers**
```ts
interface IMayaTriggerDefinition {
    // environment configuration of the http processor
    // added by processor, user DOES NOT pass this
    environment?: IEnvironment,


    // object containing prompts to make to user when trigger being processed
    // if autonomous is true, default values are used
    // passed by user
    prompt?: {
        name: "Yash Kumar Verma",
        age: 21
    }


    // unique identifier for the trigger, used to call other triggers
    // passed by user
    name: string | ContextualFunction<IContext, string>


    // one of the HTTP method
    // passed by user
    method: Method


    // URL for the HTTP request, or function which returns a string
    // passed by user
    url: string | ContextualFunction<IContext, string>


    // header for HTTP request, record<String, string> or function which returns the same
    // passed by user
    header?: IHeader | ContextualFunction<IContext, IHeader>


    // http body sent as payload, can be a contextual function which returns an object
    // passed by user
    body?: any | ContextualFunction<IContext, any>


    // function to run on data returned after HTTP request
    // passed by user
    response?: (
        // instance of environment configurations
        environment: {},
        
        // data collected from user prompt, or defaults if autonomous is true
        prompt: {},
        
        // full configuration of the trigger object 
        trigger: {},

        // complete HTTP response object
        response: {}
    ) => {}


    // names of triggers to run before and after current trigger 
    // passed by user
    before?: Array<string>
    after?: Array<string>


    // setting true will force default values for prompt variables
    // passed by user
    autonomous?: boolean
}
```
*properties which have an asterisk `*` mean that they're optional*

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
