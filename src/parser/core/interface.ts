import { Parameter } from "./parameter/interface"
import { Method } from "./method/interface"
import { ContextualFunction } from "./context/interface"

export interface MayaTriggerDefinition {

    /** objects to fetch from the environment */
    environment?: Record<string, Parameter>,

    /** objects to prompt the user for input */
    prompt?: Record<string, any>

    /** http method of the request */
    method: Method

    /** url of the request */
    url: string | ContextualFunction<string>

    header?: Record<string, string> | ContextualFunction<string>

    body?: any | ContextualFunction<any>

    response?: ContextualFunction<any>
}
