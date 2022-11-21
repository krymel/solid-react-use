import { createUniqueId } from 'solid-js'

/**
 * Use a stable DOM id, e.g. to automatically link
 * labels to input fields.
 *
 * ```typescript
 * import { useDomId } from "solid-react-use"
 *
 * const idToUseForLabel = useDomId()
 * ```
 */
export const useDomId = createUniqueId
