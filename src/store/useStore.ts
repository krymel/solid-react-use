import type { Store, SetStoreFunction } from 'solid-js/store'
import { createStore } from 'solid-js/store'

export type UseStoreOptions<T> = {
  name?: string

  /**
   * Creates a serialized snapshot of the state (deep clone)
   * to allow for a before/after state access pattern
   */
  snapshot?: boolean

  /**
   * The function is called with all arguments passed to the state setter.
   * It can be used for tracing, to alter the setter call parameters etc.
   * It MUST return the arguments, mutated or not.
   */
  onBeforeSet?: (...args: Array<unknown>) => Array<unknown>

  /**
   * The function is called with all arguments passed to the state setter.
   * It is called after the new state has been set in the store.
   * It can be used to catch every state update and therefore e.g.
   * to implement custom store persistency as we do it in
   * useStoreWithPersistence()
   */
  onAfterSet?: (...args: Array<unknown>) => void
}

export const SymbolUseStore = Symbol.for('@@UseStore') || '@@UseStore'

export type UseStore<T extends object = {}, O = UseStoreOptions<T>> = <T extends object = {}>(
  ...[store, options]: {} extends T ? [store?: T | Store<T>, options?: O] : [store: T | Store<T>, options?: O]
) => [get: Store<T>, set: SetStoreFunction<T>]

/**
 * Use a store that can snapshot-serialize its whole state and has pre and post-setter call hooks.
 *
 * ```typescript
 * const [todoState, setTodoState] = useStoreWithPersistence({
 *   todos: [{ id: 1, text: 'foo', done: false }, { id: 2, text: 'bar', done: true }]
 * }, {
 *   name: 'todos',
 *   snapshot: true,
 *   onBeforeSet(...setterArgs) {
 *     // you might want to alter the setter arguments
 *     //setterArgs[2] = 'completed'
 *     console.log('data state before change is', this)
 *     return setterArgs
 *   },
 *   onAfterSet(...setterArgs) {
 *     // you might want to call functionality after the store has been mutated
 *     console.log('store data changed using prameters', setterArgs)
 *     console.log('data state after change is', this)
 *   }
 * })
 * ```
 */
export const useStore: UseStore = <T>(...[store, options]) => {
  const storeCreated = createStore(...[store, options])
  const [s, setS] = storeCreated

  // higher order hook to capture each set() call and notify the before/after hooks
  storeCreated[1] = (...args: Array<unknown>) => {
    const snapshot = options.snapshot ? JSON.parse(JSON.stringify(s)) : s
    if (typeof options.onBeforeSet === 'function') {
      args = options.onBeforeSet.apply(snapshot, args)
    }
    const result = setS(...(args as Parameters<SetStoreFunction<T>>))
    if (typeof options.onAfterSet === 'function') {
      options.onAfterSet.apply(s, args)
    }
    return result
  }

  // annotate runtime type, but don't break any contract
  Object.defineProperty(storeCreated, SymbolUseStore, {
    configurable: false,
    value: true,
    enumerable: false,
    writable: false,
  })
  return storeCreated
}

export type UseStoreInstance = [get: unknown, set: SetStoreFunction<unknown>]

/**
 * Test if an arbitraty value is a UseStore instance
 */
export const isUseStore = (value: unknown) => value[SymbolUseStore]
