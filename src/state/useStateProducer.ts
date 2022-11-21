import type { Setter, Accessor } from 'solid-js'
import { from } from 'solid-js'

export type CustomProducerOrProducer<T> =
  | ((setter: Setter<T | undefined>) => () => void)
  | {
      subscribe: (fn: (v: T) => void) =>
        | (() => void)
        | {
            unsubscribe: () => void
          }
    }

/**
 * Use a producer to asynchronously announce new data using
 * a setter. Data changes are reactively recognized. Implement
 * a cleanup function that is automatically called when the
 * producer is not needed anymore.
 *
 * ```
 * import { useStateProducer } from "solid-hooked"
 *
 * const [randomNumber, setRandomNumber] = useState(345)
 *
 *  const randomNumberProducer = useStateProducer<number>((set) => {
 *    const t = setInterval(() => set(Math.random() * 1000), 1000);
 *    return () => clearInterval(t);
 *  })
 *
 *  useEffect(() => {
 *    // invoked every second because the producer is used and announces
 *    // a new number every second.
 *    setRandomNumber(randomNumberProducer())
 *  })
 *
 *  useEffect(() => {
 *    // invoked every second, because randomNumber() is asked
 *    console.log('a new random number has been produced', randomNumber())
 *  })
 * ```
 */
export const useStateProducer = <V>(subscribable: CustomProducerOrProducer<V>): Accessor<V> =>
  from(subscribable as CustomProducerOrProducer<V>)
