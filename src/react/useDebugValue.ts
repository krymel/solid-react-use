/**
 * `useDebugValue` can be used to display a label for custom hooks in React DevTools.
 * [re-solid] Maps to console.log
 *
 * NOTE: We don’t recommend adding debug values to every custom hook.
 * It’s most valuable for custom hooks that are part of shared libraries.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usedebugvalue
 */
export const useDebugValue = <T>(value: T, format?: (value: T) => unknown) => 
    console.debug(format ? format(value): value)