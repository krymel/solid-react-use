import { usePlatform } from "../platform/usePlatform"

/**
 * Tests if localStorage and sessionStorage can be used.
 * 
 * ```typescript
 * import { useCanUseBrowserStroage } from "solid-hooked"
 * 
 * const canUseLocalStorageOrSessionStorage = useCanUseBrowserStroage()
 * ```
 */
export const useCanUseBrowserStroage = () => {

    if (!(usePlatform().isBrowser)) {
        return false
    }

    try {
        const randomKey = '@@__canUseBrowserStroage'
        window.localStorage.setItem('@@__canUseBrowserStroage', null)
        window.localStorage.getItem(randomKey)
        window.localStorage.removeItem(randomKey)
        return true
    } catch(e) {
        return false
    }
}