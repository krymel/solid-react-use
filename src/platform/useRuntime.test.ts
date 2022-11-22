import { useRuntime } from './useRuntime'

describe('usePlatform', () => {
  const { isBrowser, isServer, isWebWorker } = useRuntime()

  it('makes sure that all properties are', () => {
    expect(isBrowser).toBeDefined()
    expect(isServer).toBeDefined()
    expect(isWebWorker).toBeDefined()

    expect(typeof isBrowser).toBe('boolean')
    expect(typeof isServer).toBe('boolean')
    expect(typeof isWebWorker).toBe('boolean')
  })
})
