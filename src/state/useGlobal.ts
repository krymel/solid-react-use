const getGlobal = <T>(identifier: string): T => (globalThis as unknown)[identifier]
const setGlobal = <T>(identifier: string, value: T) => (globalThis as unknown)[identifier] = value

/**
 * Atomically accessing and mutating variables on global scope.
 * 
 * ```typescript
 * import { useGlobal } from "solid-hooked"
 * 
 * const [location, setLocation] = useGlobal('location')
 * 
 * // Node.js
 * location() // undefined
 * 
 * // Browser
 * location() // window.location object
 * 
 * // can be used to work with variables cross-module scope
 * const [someGlobal, setSomeGlobal] = useGlobal('myAppScope_someGlobal', 'defaultValue')
 * 
 * someGlobal() // 'defaultValue'
 * 
 * setSomeGlobal('bar') // 'bar'
 * someGlobal() // 'bar'
 * ```
 */
export const useGlobal = <T>(identifier: string, defaultValue?: T): [() => T, (v: T) => T] => {
    if (typeof getGlobal<T>(identifier) === "undefined") {
        setGlobal(identifier, defaultValue)
    }
    return [() => getGlobal(identifier), (value: T) => setGlobal(identifier, value)]
}
    