import { usePlatform } from "./usePlatform";

/**
 * A function that only runs on the server-side / SSR (Node.js, Deno, JsDom).
 * 
 * ```ts
 * import { useSSROnly } from "solid-hooked"
 * 
 * // only runs on server
 * useSSROnly(() => {
 *   console.log('only on server')
 * });
 * ```
 */
export const useSSROnly = <T>(callback: () => T): T|void => {
    const platform = usePlatform()
    if (platform.isDeno || platform.isNode || platform.isJsDom) {
        return callback()
    }
}