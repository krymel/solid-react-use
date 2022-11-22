import { vi } from 'vitest'
import { useServerOnly } from './useServerOnly'

describe('useServerOnly', () => {
  it('only execute function when in server environment (mocked)', () => {
    const cb = vi.fn()
    useServerOnly(cb, {
      isBrowser: false,
      isServer: true,
      isWebWorker: false,
    })
    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('does not execute function when not in server environment', () => {
    const cb = vi.fn()
    useServerOnly(cb, {
      isBrowser: false,
      isServer: false,
      isWebWorker: false,
    })
    expect(cb).toHaveBeenCalledTimes(0)
  })

  it('does not execute in node testing environment (not in SSR mode)', () => {
    const cb = vi.fn()
    useServerOnly(cb)
    expect(cb).toHaveBeenCalledTimes(0)
  })
})
