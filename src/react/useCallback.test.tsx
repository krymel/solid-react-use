import { fireEvent, render } from '@solidjs/testing-library'
import { vi } from 'vitest'
import { useCallback } from './useCallback'

describe('useCallback', () => {
  it('calls the callback on button click', async () => {
    const callback = vi.fn((evt: Event) => {
      expect(evt).toBeDefined()
      expect(evt).toBeInstanceOf(Event)
    })

    const onMouseClick = useCallback(callback)

    const { queryByRole, unmount } = render(() => (
      <button role={"button"} onClick={onMouseClick}></button>
    ))
    const button = (await queryByRole('button')) as HTMLButtonElement
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(callback).toBeCalledTimes(1)
    unmount()
  })
})
