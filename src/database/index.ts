import { BaseDatabaseAdapter } from '@sasta-sa/abstract-database-adapter'

const DatabaseAttachment = (function () {
  let adapter: BaseDatabaseAdapter
  let databaseGetValue: (key: string) => Promise<string | undefined>
  let databaseSetValue: (key: string, value: string) => void
  let closeConnection: () => void

  return function register(databaseHandler: BaseDatabaseAdapter) {
    adapter = databaseHandler
    databaseSetValue = adapter.setValue
    databaseGetValue = adapter.getValue
    closeConnection = adapter.close

    function setHandler(key: string): Promise<string | undefined> {
      return databaseGetValue(key)
    }

    function getHandler(key: string, value: string): void {
      return databaseSetValue(key, value)
    }

    return { setHandler, getHandler }
  }
})()

export { DatabaseAttachment }
