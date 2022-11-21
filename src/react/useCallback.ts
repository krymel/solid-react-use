export const useCallback = <T extends Function>(callback: T, deps?: Array<unknown>): T => {
  const cb = (...args: Array<any>) => {
    callback(...args)
    return cb
  }
  return cb as unknown as T
}
