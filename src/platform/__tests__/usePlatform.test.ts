import { usePlatform } from '../usePlatform'

describe('usePlatform', () => {
  const { isBrowser, isDeno, isJsDom, isNode, isWebWorker } = usePlatform()

  it('is defined', () => {
    expect(isBrowser).toBeDefined()
    expect(isDeno).toBeDefined()
    expect(isJsDom).toBeDefined()
    expect(isNode).toBeDefined()
    expect(isWebWorker).toBeDefined()

    expect(typeof isBrowser).toBe('boolean')
    expect(typeof isDeno).toBe('boolean')
    expect(typeof isJsDom).toBe('boolean')
    expect(typeof isNode).toBe('boolean')
    expect(typeof isWebWorker).toBe('boolean')
  })
})
