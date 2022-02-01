import { SastaSaProject } from '../src/index'
import { InMemoryAdapter } from '@sasta-sa/in-memory-database-adapter'

const worker = async () => {
    const handler = new SastaSaProject()
    const adapter = new InMemoryAdapter()
    handler.attachDatabase(adapter)
}

worker()
