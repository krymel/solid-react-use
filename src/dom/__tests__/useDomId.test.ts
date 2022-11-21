import { useDomId } from '../useDomId'

describe('useDomId', () => {
  it('generates a DOM id', () => {
    expect(useDomId).toBeInstanceOf(Function)
    expect(() => useDomId()).toThrowError('createUniqueId cannot be used under non-hydrating context')
  })
})
