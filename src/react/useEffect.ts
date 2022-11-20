import { createEffect, createRenderEffect } from "solid-js";
import { Destructor, DependencyList } from "./reactTypes";

export type EffectCallback = () => (void | Destructor);

/**
 * Accepts a function that contains imperative, possibly effectful code.
 * 
 * [re-solid] Bridging method: a higher order createEffect that ignores the passed dependencies.
 *
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 *
 * @version 16.8.0
 * @see https://reactjs.org/docs/hooks-reference.html#useeffect
 */
export type UseEffect = (effect: EffectCallback, deps?: DependencyList) => void|Promise<unknown>;

export const useEffect = createEffect

/**
 * [re-solid] Bridging method: shortcut for createRenderEffect
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
type UseLayoutEffect = UseEffect

export const useLayoutEffect: UseLayoutEffect = createRenderEffect

/**
 * Insert styles into the DOM.
 * [re-solid] Maps to createEffect, deps are ignored.
 * @param effect Imperative function that can return a cleanup function
 * @param deps If present, effect will only activate if the values in the list change.
 *
 * @see https://github.com/facebook/react/pull/21913
 */
type UseInsertionEffect = (effect: EffectCallback, deps?: DependencyList) => void;

export const useInsertionEffect: UseInsertionEffect = createRenderEffect