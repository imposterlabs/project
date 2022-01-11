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

## Testing
It is recommended to use a service like [webhook.site](https://webhook.site/) to inspect the requests.