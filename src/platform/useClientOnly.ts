import { useRuntime } from './useRuntime'
import type { Runtime } from './useRuntime'

// TODO: rename: useClientOnly
/**
 * Use a function only on client-side but *never* on server-side (SSR).
 *
 * ```ts
 * import { useClientOnly } from "solid-react-use"
 *
 * // only runs on server
 * useClientOnly(() => {
 *   console.log('only on client aka. Browser or Worker')
 * });
 * ```
 */
export const useClientOnly = <T>(callback: () => T, platform: Runtime = useRuntime()): T | void => {
  if (platform.isBrowser || platform.isWebWorker) {
    return callback()
  }
}
