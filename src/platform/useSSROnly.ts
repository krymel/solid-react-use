import { PlatformRuntime, usePlatform } from './usePlatform'

// TODO: rename: useServerOnly
/**
 * A function that only runs on the server-side / SSR (Node.js, Deno, JsDom).
 *
 * ```ts
 * import { useSSROnly } from "solid-react-use"
 *
 * // only runs on server
 * useSSROnly(() => {
 *   console.log('only on server')
 * });
 * ```
 */
export const useSSROnly = <T>(callback: () => T, platform: PlatformRuntime = usePlatform()): T | void => {
  if (platform.isDeno || platform.isNode || platform.isJsDom) {
    return callback()
  }
}
