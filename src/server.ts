import { IMayaRouteDefinition } from "./parser/core/interface";
import { METHOD } from "./parser/core/method";
import { HttpWebServer } from "./processor/express"
import { repeat } from "./common/responseHelpers";

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
    }
]

const server = new HttpWebServer();
server.registerRoutes(routeMaps);
server.start()
