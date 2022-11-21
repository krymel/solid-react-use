import { useCSROnly } from '../useCSROnly'

describe('useCSROnly', () => {
  it('only executed function when in browser environment', () => {
    const cb = jest.fn()
    useCSROnly(cb, {
      isBrowser: true,
      isDeno: false,
      isJsDom: false,
      isNode: false,
      isWebWorker: false,
    })
  })

  it('only executed function when in worker environment', () => {
    const cb = jest.fn()
    useCSROnly(cb, {
      isBrowser: false,
      isDeno: false,
      isJsDom: false,
      isNode: false,
      isWebWorker: true,
    })

    expect(cb).toHaveBeenCalledTimes(1)
  })

  it('only executed function when not in browser or worker environment', () => {
    const cb = jest.fn()
    useCSROnly(cb, {
      isBrowser: false,
      isDeno: false,
      isJsDom: false,
      isNode: false,
      isWebWorker: false,
    })

    expect(cb).toHaveBeenCalledTimes(0)
  })

  it('does not execute in node testing environment', () => {
    const cb = jest.fn()
    useCSROnly(cb)

    expect(cb).toHaveBeenCalledTimes(0)
  })
})
