import { Method } from "./interface"

const METHOD: Record<string, Method> = {
    HEAD: {
        name: "head",
        hasBody: false,
        hasResponse: false,
        axiosProvider: "head"
    },
    GET: {
        name: "get",
        hasBody: false,
        hasResponse: true,
        axiosProvider: "get"
    },
    POST: {
        name: "post",
        hasBody: true,
        hasResponse: true,
        axiosProvider: "post"
    },
    PUT: {
        name: "put",
        hasBody: true,
        hasResponse: true,
        axiosProvider: "put"
    },
    DELETE: {
        name: "delete",
        hasBody: true,
        hasResponse: true,
        axiosProvider: "delete"
    },
    OPTIONS: {
        name: "options",
        hasBody: false,
        hasResponse: true,
        axiosProvider: "options"
    }
}

export { METHOD }