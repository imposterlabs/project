import { Method } from "./method/interface"
import { Parameter } from "./parameter/interface"
import { ContextualFunction } from "./context/interface"

export interface IHeader extends Record<string, string> { }
export interface IEnvironment extends Record<string, Parameter> { }
export interface IPrompt extends Record<string, any> { }

export interface IMayaTriggerDefinition {

    /** unique identifier for any trigger */
    name: string

    /** objects to fetch from the environment */
    environment?: IEnvironment,

    /** objects to prompt the user for input */
    prompt?: IPrompt

    /** http method of the request */
    method: Method

    /** url of the request */
    url: string | ContextualFunction<string>

    /** http headers sent along-with request */
    header?: IHeader | ContextualFunction<string>

    /** http body sent as payload */
    body?: any | ContextualFunction<any>

    /** function to run on response of data */
    response?: ContextualFunction<any>

    /** names of triggers to run before and after current trigger */
    before: Array<string>
    next: Array<string>

    /** use defaults in place of prompt variables */
    autonomous?: boolean
}
