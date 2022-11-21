import type { Setter, Signal } from 'solid-js'

export interface Interceptors<T> {
  preGet?: (signal: Signal<T>) => void
  postGet?: (value: T) => T
  preSet?: (...args: Parameters<Setter<T>>) => Parameters<Setter<T>>
  postSet?: (signal: Signal<T>) => void
}

/**
 * Use `useState()`, `useStore()` with an interceptor to get
 * hook callbacks called before (`pre`) and after (`post`)
 * a status is `get` or `set`.
 *
 * This higher order function might be used to implement custom
 * advanced signal processing, diagnostics, logging, broadcasting
 * or persistency purposes. It's a powerful tool for advanced users.
 *
 * ```typescript
 * import { withInterceptors } from "solid-react-use"
 *
 * const [state, setState] = withInterceptors<number>(useState(1000), {
 *   postGet: (value: number) => {
 *       console.log('changing number before it can be get()')
 *       return value * 2 // multiplies a value on the fly by 2 but doesn't mutate it internally
 *   }
 * })
 *
 * // prints 'changing number before it can be get()' to the console
 * state() // 2000
 * ```
 */
export const withInterceptors = <T>(signal: Signal<T>, interceptors: Interceptors<T>): Signal<T> => {
  const [s, setS] = signal
  return [
    () => {
      if (typeof interceptors.preGet === 'function') {
        interceptors.preGet(signal)
      }
      const value = s()
      if (typeof interceptors.postGet === 'function') {
        return interceptors.postGet(value)
      }
      return value
    },
    (...args: Parameters<Setter<T>>) => {
      if (typeof interceptors.preSet === 'function') {
        args = interceptors.preSet.apply(null, args)
      }
      setS.apply(null, args)
      if (typeof interceptors.postSet === 'function') {
        interceptors.postSet(signal)
      }
    },
  ] as Signal<T>
}
