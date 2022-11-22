import type { Accessor } from 'solid-js'
import { createMemo } from 'solid-js'
import { DependencyList } from './reactTypes'

// allow undefined, but don't make it optional as that is very likely a mistake
type UseMemo = <T>(factory: () => T, deps?: DependencyList) => Accessor<T>

/**
 * [re-solid] Custom implementation using a higher order createEffect and dependency checking.
 * Provides semantic guarantee using a stable cache. https://github.com/alexreardon/use-memo-one/blob/master/src/index.js
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#usememo
 */
export const useMemo: UseMemo = createMemo
