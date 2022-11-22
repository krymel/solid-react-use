import { useUpperCaseFirst } from './useUpperCaseFirst'

describe('useUpperCaseFirst', () => {
  it('turns the first character in a string to uppercase', () => {
    const uc = useUpperCaseFirst('fooF')
    expect(uc).toEqual('FooF')
  })
})
