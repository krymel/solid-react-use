import { createSignal } from 'solid-js'
import type { SignalOptions } from 'solid-js/types/reactive/signal'

export type SetStateAction<S> = S | ((prevState: S) => S)
export type GetStateAction<S> = () => S
export type Dispatch<A> = (value: A) => void

/**
 * Returns a stateful value, and a function to update it.
 *
 * [re-solid] Bridging method: a higher order createSignal, but the "value" is always a GetStateAction
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */
type UseState = <S = undefined>(value: S) => [GetStateAction<S> | undefined, Dispatch<SetStateAction<S | undefined>>]

export const SymbolUseState = Symbol.for('@@UseState') || '@@UseState'

export const useState: typeof createSignal = <T>(value?: T, options?: SignalOptions<T>) => {
  const signal = createSignal(value, options)

  // annotate runtime type, but don't break any contract
  Object.defineProperty(signal, SymbolUseState, {
    configurable: false,
    value: true,
    enumerable: false,
    writable: false,
  })

  return signal
}
