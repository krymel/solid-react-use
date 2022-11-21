/**
 * MIT © Dineshkumar Pandiyan, @flexdinesh and collaborators
 * npm: https://www.npmjs.com/package/browser-or-node
 * github: https://github.com/flexdinesh/browser-or-node
 */
/* istanbul ignore next */
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

/* istanbul ignore next */
const isWebWorker =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope'

/* istanbul ignore next */
const isJsDom =
  (typeof window !== 'undefined' && window.name === 'nodejs') ||
  (typeof navigator !== 'undefined' &&
    (navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom')))

/* @ts-ignore */ /* istanbul ignore next  */
const isDeno = typeof Deno !== 'undefined' && typeof Deno.core !== 'undefined'

export interface PlatformRuntime {
  isBrowser: boolean
  isDeno: boolean
  isJsDom: boolean
  isNode: boolean
  isWebWorker: boolean
}

/**
 * Use platform information to decide for code execution
 * at runtime.
 *
 * ```typescript
 * import { usePlatform } from "solid-react-use"
 *
 * const { isBrowser, isDeno, isJsDom, isNode, isWebWorker } = usePlatform()
 *
 * isBrowser // true
 * isNode // false
 * ```
 */
export const usePlatform = (): PlatformRuntime => ({
  isBrowser,
  isDeno,
  isJsDom,
  isNode,
  isWebWorker,
})
