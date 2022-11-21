import { reconcile } from 'solid-js/store'
import { useCanUseBrowserStroage } from './useCanUseBrowserStorage'
import { useGlobal } from '../state/useGlobal'
import { save, read, autoSelectStorageInterface } from './useStorage'

export interface PersistenceProvider<T extends {}> {
  save(key: string, state: T): Promise<boolean>
  load(key: string, defaultState: T): Promise<T>
}

export class InMemoryStorageBackend implements Partial<Storage> {
  getGlobalKey(key: string) {
    return `@@InMemoryStorageBackend_${key}`
  }
  getItem(key: string) {
    return useGlobal<string>(this.getGlobalKey(key))[0]()
  }
  setItem(key: string, value: string) {
    return useGlobal<string>(this.getGlobalKey(key))[1](value)
  }
}

export const inMemoryStorageBackend = new InMemoryStorageBackend()

export abstract class BasePersistenceProvider<T> implements PersistenceProvider<T> {
  constructor(protected storageInterface: Partial<Storage>) {}

  save(key: string, state: T): Promise<boolean> {
    save(this.storageInterface, key, state)
    return Promise.resolve(true)
  }
  async load(key: string, defaultState: T): Promise<T> {
    const state = Promise.resolve(read(this.storageInterface, key))

    // null means that there is no value at all,
    // fallback to default value jere
    if ((await state) === null) {
      return defaultState || ({} as T)
    }
    return Promise.resolve(reconcile(state)(defaultState || {}))
  }
}

export class InMemoryPersistenceProvider<T> extends BasePersistenceProvider<T> {
  constructor() {
    super(inMemoryStorageBackend)
  }
}

export class BrowserStoragePersistenceProvider<T> extends BasePersistenceProvider<T> {
  constructor(storageInterfaceType: 'localStorage' | 'sessionStorage' | 'memory') {
    super(autoSelectStorageInterface(storageInterfaceType))
  }
}

/**
 * Use a high level abstraction layer for persistency.
 * Defaults to 'localStorage' in browsers (CSR), but can be set to 'sessionStorage' or 'memory'.
 * Defaults to 'memory' on server (SSR).
 * Advanced users can inject a custom persistence provider implementing `BasePersistenceProvider<T>`
 *
 * ```typescript
 * import { usePersistence } from "solid-react-use"
 *
 * interface YourType {}
 *
 * const persistence = usePersistence<YourType>() //
 *
 * persistence.load('someUniqueKeyForYourData') // loads the latest persisted state of YourType
 * persistence.save('someUniqueKeyForYourData', {} as YourType) // saves the latest state of YourType
 * ```
 */
export const usePersistence = <T>(
  storageInterfaceType: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage',
  injectPersistenceProvider?: BasePersistenceProvider<T>,
): BasePersistenceProvider<T> => {
  if (injectPersistenceProvider) return injectPersistenceProvider

  const inMemoryPersistenceProvider = new InMemoryPersistenceProvider<T>()
  if (storageInterfaceType && storageInterfaceType == 'memory') {
    return inMemoryPersistenceProvider
  }
  return useCanUseBrowserStroage()
    ? new BrowserStoragePersistenceProvider<T>(storageInterfaceType)
    : inMemoryPersistenceProvider
}
