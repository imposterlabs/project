import { IOrphanValue } from "./interface"
import { RedisAdapter } from '../../database/redis';


async function SaveAsOrphan(key: string, value: any) {
    const handler = await new RedisAdapter({})
    const payload: IOrphanValue = { payload: value }
    await handler.setValue(key, JSON.stringify(payload))
    handler.close()
}

async function RetrieveOrphan(key: string): Promise<any> {
    const handler = await new RedisAdapter({})
    const savedValue = await handler.getValue(key)
    handler.close()

    if (savedValue === undefined) { return undefined }
    return JSON.parse(savedValue)
}

export { SaveAsOrphan, RetrieveOrphan }