import { vi } from 'vitest'
import { useClientOnly } from './useClientOnly'

describe('useClientOnly', () => {
  it('does execute function when in browser environment (mocked)', () => {
    const cb = vi.fn()
    useClientOnly(cb, {
      isBrowser: true,
      isServer: false,
      isWebWorker: false,
    })
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('does execute function when in worker environment (mocked)', () => {
    const cb = vi.fn()
    useClientOnly(cb, {
      isBrowser: false,
      isServer: false,
      isWebWorker: true,
    })
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('does not execute function when not in browser or worker environment', () => {
    const cb = vi.fn()
    useClientOnly(cb, {
      isBrowser: false,
      isServer: false,
      isWebWorker: false,
    })
    expect(cb).toHaveBeenCalledTimes(0)
  })

  it('does execute in testing environment (jsdom mock based)', () => {
    const cb = vi.fn()
    useClientOnly(cb)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
