import type { Accessor } from 'solid-js'
import { useCanUseBrowserStroage } from './useCanUseBrowserStorage'
import { useStorageInMemory } from './useStorageInMemory'

/**
 * The web storage API with a generic twist.
 */
export interface GenericStorage<T> {
  /** Returns the number of key/value pairs. */
  readonly length: number

  /** Returns the internal cache map holding all values */
  readonly map: Map<string, T>

  /**
   * Removes all key/value pairs, if there are any.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  clear(): void

  /** Returns the current value associated with the given key, or null if the given key does not exist. */
  getItem(key: string): T | null

  /** Returns the name of the nth key, or null if n is greater than or equal to the number of key/value pairs. */
  key(index: number): string | null

  /**
   * Removes the key/value pair with the given key, if a key/value pair with the given key exists.
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  removeItem(key: string): void

  /**
   * Sets the value of the pair identified by key to value, creating a new key/value pair if none existed for key previously.
   *
   * Throws a "QuotaExceededError" DOMException exception if the new value couldn't be set. (Setting could fail if, e.g., the user has disabled storage for the site, or if the quota has been exceeded.)
   *
   * Dispatches a storage event on Window objects holding an equivalent Storage object.
   */
  setItem(key: string, value: T): void
}

export const save = <T>(storageInterface: Partial<GenericStorage<string>>, key: string, value: T) => {
  return storageInterface.setItem(key, JSON.stringify(value))
}

export const read = (storageInterface: Partial<GenericStorage<string>>, key: string) => {
  const serializedValue = storageInterface.getItem(key)

  try {
    return JSON.parse(serializedValue)
  } catch (e) {
    if (typeof serializedValue !== 'undefined') {
      throw e
    }
    return
  }
}

const inMemoryStorage = useStorageInMemory()

export const autoSelectStorageInterface = (storageInterfaceType: 'localStorage' | 'sessionStorage' | 'memory') => {
  let storageInterface: Partial<GenericStorage<string>> = inMemoryStorage

  // fallback, in case Storage API is not available.
  if (!useCanUseBrowserStroage()) {
    storageInterface = inMemoryStorage
    console.warn(`autoSelectStorageInterface(): the browser Storage API is not available (e.g. SSR, Worker, private mode).
Using in-memory API instead (persistence limited to this very browser session).`)
    return storageInterface
  }

  switch (storageInterfaceType) {
    case 'localStorage':
      storageInterface = window.localStorage
      break
    case 'sessionStorage':
      storageInterface = window.sessionStorage
      break
  }
  return storageInterface
}

export type StoredValueAccessor<T> = Accessor<T>
export type StoredValueSetter<T> = (value: T) => void

/**
 * Use a low-level, non-reactive storage API that abstracts the
 * Web Storage API and makes it generic. Advanced users only.
 *
 * You probably want to use the reactive `useStateWithPersistence()` instead.
 */
export const useStorage = <T>(
  initialValue: T,
  uniqueName: string,
  storageInterfaceType: 'localStorage' | 'sessionStorage' | 'memory' = 'localStorage',
  injectStorage?: GenericStorage<string>,
) => {
  const storage = injectStorage ?? autoSelectStorageInterface(storageInterfaceType)

  return [() => read(storage, uniqueName) || initialValue, (value: T) => save<T>(storage, uniqueName, value)] as [
    StoredValueAccessor<T>,
    StoredValueSetter<T>,
  ]
}
