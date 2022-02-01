import { IOrphanValue } from './interface'
import { getValue, setValue, closeConnection } from '../../database'

async function SaveAsOrphan(key: string, value: any) {
    const payload: IOrphanValue = { payload: value }
    await setValue(key, JSON.stringify(payload))
    closeConnection()
}

async function RetrieveOrphan(key: string): Promise<any> {
    const savedValue = await getValue(key)
    closeConnection()

    if (savedValue === undefined || savedValue === null) {
        return null
    }
    return JSON.parse(savedValue)
}

export { SaveAsOrphan, RetrieveOrphan }
