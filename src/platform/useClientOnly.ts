import { usePlatform } from './usePlatform'
import type { PlatformRuntime } from './usePlatform'

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
export const useClientOnly = <T>(callback: () => T, platform: PlatformRuntime = usePlatform()): T | void => {
  if (platform.isBrowser || platform.isWebWorker) {
    return callback()
  }
}
