import { Parameter } from "./interface"

const PARAMETER: Record<string, Parameter> = {
    REQUIRED: {
        name: "required",
        required: true,
        warning: false,
        error: false
    },
    OPTIONAL: {
        name: "optional",
        required: false,
        warning: true,
        error: false
    }
}


export { PARAMETER }