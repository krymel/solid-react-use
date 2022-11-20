import { atom } from "solid-use";

/**
 * Use an atomic local state
 * ```ts
 * import { useAtom } from "solid-hooked"
 * 
 * const message = useAtom('Hello');
 * 
 * message() // 'Hello'
 * message('Foo') // void
 * message() // 'Foo'
 * ```
 */
export const useAtom = <T>(value: T) => atom(value)