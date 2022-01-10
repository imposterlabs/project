import { Request, Response } from "express"
/**
 * The context that is passed/returned  at runtime.
 */
export interface IContext {
    environment: any;
    prompt: any;
}

/** syntactic sugar */
export interface ContextAsParameter extends IContext { }


/** ContextualFunction is a function that exports the context for programmable behavior */
export interface ContextualFunction<ContextType, ReturnType> {
    (context: ContextType): ReturnType;
}

export interface IHttpContext extends IContext {
    request: Request
}

