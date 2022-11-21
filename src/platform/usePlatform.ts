/**
 * MIT © Dineshkumar Pandiyan, @flexdinesh and collaborators
 * npm: https://www.npmjs.com/package/browser-or-node
 * github: https://github.com/flexdinesh/browser-or-node
 */
const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined'

const isNode = typeof process !== 'undefined' && process.versions != null && process.versions.node != null

const isWebWorker =
  typeof self === 'object' && self.constructor && self.constructor.name === 'DedicatedWorkerGlobalScope'

const isJsDom =
  (typeof window !== 'undefined' && window.name === 'nodejs') ||
  (typeof navigator !== 'undefined' &&
    (navigator.userAgent.includes('Node.js') || navigator.userAgent.includes('jsdom')))

// @ts-ignore
const isDeno = typeof Deno !== 'undefined' && typeof Deno.core !== 'undefined'

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
export const usePlatform = () => ({
  isBrowser,
  isDeno,
  isJsDom,
  isNode,
  isWebWorker,
})
