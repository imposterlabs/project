import { StateHandler, PersistentStateHandler } from "./state/useState"
import { RedisAdapter } from "./database/redis"




const worker = async () => {
    const { get, set } = await PersistentStateHandler(10);
    console.log(`Reading value from database : ${await get()}`)
    set(200)
}

worker()





