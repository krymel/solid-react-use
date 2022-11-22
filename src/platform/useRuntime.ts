import { isServer } from 'solid-js/web'

/**
 * MIT © Dineshkumar Pandiyan, @flexdinesh and collaborators
 * npm: https://www.npmjs.com/package/browser-or-node
 * github: https://github.com/flexdinesh/browser-or-node
 */
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

const isWebWorker =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope'

export interface Runtime {
  isBrowser: boolean
  isServer: boolean
  isWebWorker: boolean
}

/**
 * Use platform information to decide for code execution
 * at runtime.
 *
 * ```typescript
 * import { useRuntime } from "solid-react-use"
 *
 * const { isBrowser, isServer, isWebWorker } = useRuntime()
 *
 * isBrowser // true
 * isNode // false
 * ```
 */
export const useRuntime = (): Runtime => ({
  isBrowser,
  isServer,
  isWebWorker,
})
