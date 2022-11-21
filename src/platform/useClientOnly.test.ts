import { vi } from 'vitest'
import { useClientOnly } from './useClientOnly'

describe('useClientOnly', () => {
  it('only executed function when in browser environment', () => {
    const cb = vi.fn()
    useClientOnly(cb, {
      isBrowser: true,
      isDeno: false,
      isJsDom: false,
      isNode: false,
      isWebWorker: false,
    })
  })

  it('only executed function when in worker environment', () => {
    const cb = vi.fn()
    useClientOnly(cb, {
      isBrowser: false,
      isDeno: false,
      isJsDom: false,
      isNode: false,
      isWebWorker: true,
    })

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('only executed function when not in browser or worker environment', () => {
    const cb = vi.fn()
    useClientOnly(cb, {
      isBrowser: false,
      isDeno: false,
      isJsDom: false,
      isNode: false,
      isWebWorker: false,
    })

    expect(cb).toHaveBeenCalledTimes(0)
  })

  it('does execute in testing environment (jsdom)', () => {
    const cb = vi.fn()
    useClientOnly(cb)

    expect(cb).toHaveBeenCalledTimes(1)
  })
})
