import { Accessor, createSignal } from "solid-js"
import { SetStoreFunction, Store } from "solid-js/store"
import { PersistenceProvider, usePersistence } from "../storage/usePersistence"
import { useStore, UseStoreOptions } from "./useStore"

export interface StorePersistencyOptions<T> extends UseStoreOptions<T> {
    persistenceProvider?: PersistenceProvider<T>
}

export const getDefaultOptions = <T>(): StorePersistencyOptions<T> => ({
    // one BasePersistenceProvider implementation, 
    // depending on the platform
    persistenceProvider: usePersistence(), 
    name: '@@useStoreWithPersistence'
})

/**
 * Use a `useStore()` that automatically loads the last persisted state and that auto-persists on 
 * every setter call. The persistency provider comes from `usePersistence()` and is auto-selected
 * by the platform. Non-Browser: `InMemoryPersistenceProvider`, Browser: `BrowserStoragePersistenceProvider` 
 * (`localStorage`) (if not available, InMemory). Platform detection comes from by `usePlatform()`.
 * 
 * Because the persistence layer is `async` and uses `Promise` internally, the state is a `Signal`,
 * therefore, you need to treat it like one and need to call it to fetch the latest state.
 * 
 * ```typescript
 * import { useStoreWithPersistence, BasePersistenceProvider } from "solid-hooked"
 * 
 * const [todoState, setTodoState] = useStoreWithPersistence({
 *   // the initial state provided is treated as the default value
 *   todos: [
 *      { id: 1, text: 'foo', done: false }, 
 *      { id: 2, text: 'bar', done: true }
 *   ]
 * }, {
 *   // make sure to give the store a unique name as it
 *   // might 
 *   name: 'todos',
 * 
 *   // for advanced users: You can implement your own persistence provider
 *   // following the interface BasePersistenceProvider<T> and therefore 
 *   // implement an arbitrary, asynchronous storage backend for your store
 *   // persistenceProvider: [[instance of BasePersistenceProvider<T>]]
 * })
 * 
 * todoState() // the latest state; if not loaded yet, it's the default value provided
 * 
 * setTimeout(async() => {
 *   
 *   // set the first todo also to done after a sec
 *   // as persistency can theoretically be async (depending on the provider) 
 *   if (await setTodoState("todos", todo => todo.id === 1, "done", done => !done)) {
 *       // now the state is guaranteed to have been persisted
 *       todoState() // the latest state will now reflect the first todo to be done too
 *   }
 * }, 1000)
 * ```
 */
export const useStoreWithPersistence = 
    (<T extends object>(defaultState: T, options: StorePersistencyOptions<T> = getDefaultOptions<T>()) => {

    if (!options.name) {
        console.warn(`useStoreWithPersistence(${
            JSON.stringify(defaultState, null, 2).substring(0, 50)
        } ...[truncated], \n ${
            JSON.stringify(options, null, 2)
        }) was called without providing a 'name'. Using name '${
            getDefaultOptions<T>().name
        }' for now, but this can lead to data clash with other stores!`)
    }

    // apply name fallback and default persistency provider
    options = {
        ...getDefaultOptions<T>(),
        ...options
    }

    const [s, setS] = createSignal<T>(defaultState)

    let store: [get: T, set: SetStoreFunction<T>]

    const storeSetFn = (...args: Array<unknown>) => {

        const [storeState, storeSet] = store

        if (typeof storeSet === "undefined") {
            console.warn('useStoreWithPersistence(): Cannot set new state before the initial state has been loaded.')
            return Promise.resolve(false)
        }
        
        // eventually results in onAfterSet() after store processing is done
        storeSet.apply(null, args)

        // bridge to reactive signal
        setS(() => storeState)

        // lazy-persist data
        return options.persistenceProvider.save(options.name, storeState)
    }

    // initial auto-load using the configured persistencProvider
    options.persistenceProvider.load(options.name, defaultState).then((loadedState) => {
        
        const storeImpl = useStore(loadedState, {
            ...getDefaultOptions<T>(),
            ...options
        })

        // initial sync after load
        setS(() => loadedState)

        // set reference to allow for syncing from this time
        store = storeImpl
    })
    // value getter from signal, and setter from store
    return [s, storeSetFn] as [Accessor<Store<T>>, typeof storeSetFn]
})
