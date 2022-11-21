import { useDomId } from '../useDomId'

// TODO: solid-testing-library

describe('useDomId', () => {
  it('generates a DOM id', () => {
    expect(useDomId).toBeInstanceOf(Function)
    expect(() => useDomId()).toThrowError('createUniqueId cannot be used under non-hydrating context')
  })
})
