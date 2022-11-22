import { fireEvent, render } from '@solidjs/testing-library'
import { vi } from 'vitest'
import { useDebugValue } from './useDebugValue'

describe('useDebugValue', () => {

  it('prints to console.debug', async () => {
    const mock = vi.spyOn(console, 'debug').mockImplementation(() => {})

    useDebugValue('foo')

    expect(mock).toHaveBeenCalledWith('foo')

    mock.mockRestore();
  })

  it('prints to console.debug with formatting', async () => {
    const mock = vi.spyOn(console, 'debug').mockImplementation(() => {})

    useDebugValue('foo,bar', (text) => text.split(','))

    expect(mock).toHaveBeenCalledWith(['foo', 'bar'])

    mock.mockRestore();
  })
})
