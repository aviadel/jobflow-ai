import type { DataProvider } from './provider'
import { JsonProvider } from './adapters/json'

export type { DataProvider }
export * from './types'

export function createDataProvider(): DataProvider {
  const type = process.env.DATA_PROVIDER ?? 'json'
  switch (type) {
    case 'sheets': {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { SheetsProvider } = require('./adapters/sheets') as typeof import('./adapters/sheets')
      return new SheetsProvider()
    }
    case 'json':
    default:
      return new JsonProvider()
  }
}
