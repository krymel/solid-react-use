import { useSSROnly } from '../useSSROnly'

describe('useSSROnly', () => {
  it('only executed function when in server environment (Node)', () => {
    const cb = jest.fn()
    useSSROnly(cb, {
      isBrowser: false,
      isDeno: true,
      isJsDom: false,
      isNode: false,
      isWebWorker: false,
    })
  })

  it('only executed function when in worker environment (Deno)', () => {
    const cb = jest.fn()
    useSSROnly(cb, {
      isBrowser: false,
      isDeno: true,
      isJsDom: false,
      isNode: false,
      isWebWorker: false,
    })

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('only executed function when in worker environment (JsDom)', () => {
    const cb = jest.fn()
    useSSROnly(cb, {
      isBrowser: false,
      isDeno: false,
      isJsDom: true,
      isNode: false,
      isWebWorker: false,
    })

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('only executed function when not in browser or worker environment', () => {
    const cb = jest.fn()
    useSSROnly(cb, {
      isBrowser: false,
      isDeno: false,
      isJsDom: false,
      isNode: false,
      isWebWorker: false,
    })

    expect(cb).toHaveBeenCalledTimes(0)
  })

  it('does execute in node testing environment', () => {
    const cb = jest.fn()
    useSSROnly(cb)

    expect(cb).toHaveBeenCalledTimes(1)
  })
})
