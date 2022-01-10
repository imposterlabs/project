
export interface IStateHandlerAsync {
    get: () => Promise<any>
    set: (value: any) => Promise<void>
}