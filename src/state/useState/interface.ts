export interface IStateHandler<Type> {
    get: () => Type
    set: (value: Type) => void
}

export interface IStateHandlerAsync {
    get: () => Promise<any>
    set: (value: any) => Promise<void>
}