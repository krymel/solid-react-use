import { createUniqueId } from "solid-js";

/**
 * Use a stable DOM id, e.g. to automatically link 
 * labels to input fields.
 * 
 * 
 */
export const useId = createUniqueId