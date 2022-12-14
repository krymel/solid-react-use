import { createReaction } from 'solid-js'
import { UseEffect } from '../react/useEffect'

/**
 * [re-solid] Bridging method: shortcut for createReaction
 *
 * The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations.
 * Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside
 * `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.
 *
 * Prefer the standard `useEffect` when possible to avoid blocking visual updates.
 *
 * If you’re migrating code from a class component, `useLayoutEffect` fires in the same phase as
 * `componentDidMount` and `componentDidUpdate`.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#uselayouteffect
 */
type UseEffectOnce = UseEffect

export const useEffectOnce: UseEffectOnce = (cb, deps) => {
  const track = createReaction(cb)

  deps.forEach((dep) => {
    track(() => dep())
  })
}
