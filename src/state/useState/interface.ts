export interface IStateHandler<Type> {
    get: () => Type
    set: (value: Type) => void
}