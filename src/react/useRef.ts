
interface MutableRefObject<T> {
    current: T;
}

/**
 * `useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument
 * (`initialValue`). The returned object will persist for the full lifetime of the component.
 * 
 * [re-solid] Bridging method: a higher order createRef that returns { current: $ref }
 *
 * Note that `useRef()` is useful for more than the `ref` attribute. It’s handy for keeping any mutable
 * value around similar to how you’d use instance fields in classes.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
type UseRef = <T>(initialValue: T|null) => MutableRefObject<T>;

export const useRef: UseRef =  <T>(initialValue: T|null = null) => ({ current: initialValue })

