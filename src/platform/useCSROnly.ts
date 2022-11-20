import { usePlatform } from "./usePlatform";

/**
 * Use a function only on client-side but *never* on server-side (SSR).
 * 
 * ```ts
 * import { useCSROnly } from "solid-hooked"
 * 
 * // only runs on server
 * useCSROnly(() => {
 *   console.log('only on client aka. Browser or Worker')
 * });
 * ```
 */
export const useCSROnly = <T>(callback: () => T): T|void => {
    const platform = usePlatform()
    if (platform.isBrowser || platform.isWebWorker) {
        return callback()
    }
}