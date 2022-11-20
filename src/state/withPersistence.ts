import { Signal, Setter, Accessor } from "solid-js"
import { Store } from "solid-js/store"
import { withInterceptors } from "./withInterceptors"
import { BasePersistenceProvider, usePersistence } from "../storage/usePersistence"

export interface PersistenceOptions<T> {

    /**
     * Type of storage interface to use. Defaults to localStorage
     */
    storageInterfaceType?: 'localStorage' | 'sessionStorage' | 'memory',

    /**
     * A custom `BasePersistenceProvider<T>` can be injected and used
     */
    injectPersistenceProvider?: BasePersistenceProvider<T>
}

/**
 * Use a `useState()` with initial auto-load and auto-persistence on change.
 * Make sure that the name (second argument) is always app-level unique.
 * 
 * ```typescript
 * import { withPersistence } from "solid-react-use"
 * 
 * // loads the latest persisted state first
 * const [count, setCount] = withPersistence(useState(1), 'count');
 * 
 * setCount(2) // sets a new count and persists it
 * ```
 */
export const withPersistence = <T>(signal: Signal<T>, name: string, options: PersistenceOptions<T> = {}) => {
    const [s, setS] = signal
    const persistence = usePersistence(options.storageInterfaceType, options.injectPersistenceProvider)

    // initial state restore from persistency layer
    persistence.load(name, s() /* initial signal state */).then(setS)

    let savePromised: Promise<boolean>
    const [is, setIS] = withInterceptors(signal, {
        postSet() {
            // auto-save on set() and refresh promise ref
            savePromised = persistence.save(name, s())
        }
    }) 

    const promisedSetIS = (...args: Parameters<Setter<T>>) => {
        setIS.apply(null, args)
        return savePromised // sync refreshed in postSet()
    }
    return [is, promisedSetIS] as [Accessor<Store<T>>, typeof promisedSetIS]
}