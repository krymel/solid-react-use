import { Runtime, useRuntime } from './useRuntime'

/**
 * A function that only runs on the server-side / SSR (Node.js, Deno, JsDom).
 *
 * ```ts
 * import { useServerOnly } from "solid-react-use"
 *
 * // only runs on server
 * useServerOnly(() => {
 *   console.log('only on server')
 * });
 * ```
 */
export const useServerOnly = <T>(callback: () => T, platform: Runtime = useRuntime()): T | void => {
  if (platform.isServer) {
    return callback()
  }
}
