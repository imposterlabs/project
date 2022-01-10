import { Method } from "./method/interface"
import { Parameter } from "./parameter/interface"
import { ContextualFunction, IContext, IHttpContext } from "./context/interface"

export interface IHeader extends Record<string, string> { }
export interface IEnvironment extends Record<string, string> { }
export interface IPrompt extends Record<string, any> { }

export interface IMayaTriggerDefinition {
    /** objects to fetch from the environment */
    environment?: IEnvironment,

    /** objects to prompt the user for input */
    prompt?: IPrompt

    /** unique identifier for any trigger */
    name: string | ContextualFunction<IContext, string>

    /** http method of the request */
    method: Method

    /** url of the request */
    url: string | ContextualFunction<IContext, string>

    /** http headers sent along-with request */
    header?: IHeader | ContextualFunction<IContext, IHeader>

    /** http body sent as payload */
    body?: any | ContextualFunction<IContext, any>

    /** function to run on response of data */
    response?: ContextualFunction<IContext, any>

    /** names of triggers to run before and after current trigger */
    before?: Array<string>
    after?: Array<string>

    /** use defaults in place of prompt variables */
    autonomous?: boolean
}


export interface IMayaRouteDefinition {
    /** objects to fetch from the environment */
    environment?: IEnvironment,

    /** objects to prompt the user for input */
    prompt?: IPrompt

    /** unique identifier for any trigger */
    name?: string | ContextualFunction<IContext, string>

    /** http method of the request */
    method: Method

    /** url of the request */
    url: string | ContextualFunction<IContext, string>

    /** function to run on response of data */
    response: ContextualFunction<IHttpContext, any> | Record<string, any>

    /** names of triggers to run before and after current trigger */
    before?: Array<string>
    after?: Array<string>

    /** use defaults in place of prompt variables */
    autonomous?: boolean
}