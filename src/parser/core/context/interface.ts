/**
 * The context that is passed/returned  at runtime.
 */
export interface Context {
    environment: any;
    prompt: any;
}

/** syntactic sugar */
export interface ContextAsParameter extends Context { }


/** ContextualFunction is a function that exports the context for programmable behavior */
export interface ContextualFunction<Type> {
    (context: Context): Type;
}