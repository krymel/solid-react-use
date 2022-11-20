import { GenericStorage } from "./useStorage"

export interface ObjectMappable<T> {
    toObject: () => { [k: string]: T }
    fromObject: (object: { [k: string]: T }) => Map<string, T>
}

export const useStorageInMemory = <T = string>(): GenericStorage<T> & ObjectMappable<T> => {

    let cache = new Map<string, T>()
    return {
        
        clear: (): void => {
            cache.clear()
        },

        getItem: (key: string): T | null => {
            return cache.get(String(key)) ?? null
        },

        removeItem: (key: string): void => {
            cache.delete(String(key))
        },

        key: (index: number): string | null  => {
            return [...cache.keys()][Number(index)] ?? null
        },

        setItem: (key: string, value: T): void => {
            cache.set(String(key), value)
        },

        get map(): Map<string, T> {
            return cache
        },

        get length (): number {
            return cache.size
        },

        toObject: (): { [k: string]: T } => 
            Object.fromEntries<T>(cache),

        fromObject: (object: { [k: string]: T }): Map<string, T> => {
            cache = new Map<string, T>(Object.entries(object))
            return cache
        }
    }
}