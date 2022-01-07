import { Method } from "./interface"

const METHOD: Record<string, Method> = {
    GET: {
        name: "get",
        hasBody: false,
        hasResponse: true,
    },
    HEAD: {
        name: "head",
        hasBody: false,
        hasResponse: false,
    },
    POST: {
        name: "post",
        hasBody: true,
        hasResponse: true,
    },
    PUT: {
        name: "put",
        hasBody: true,
        hasResponse: true,
    },
    DELETE: {
        name: "delete",
        hasBody: true,
        hasResponse: true
    },
    OPTIONS: {
        name: "options",
        hasBody: false,
        hasResponse: true
    },
    CONNECT: {
        name: "connect",
        hasBody: false,
        hasResponse: false
    },
    TRACE: {
        name: "trace",
        hasBody: false,
        hasResponse: false
    },
    PATCH: {
        name: "patch",
        hasBody: true,
        hasResponse: true
    }
}


export { METHOD }