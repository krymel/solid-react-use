import { fireEvent, render } from '@solidjs/testing-library'
import { Mock, vi } from 'vitest'
import { useWait } from '~/time/useWait'
import { useStateProducer } from '~/state/useStateProducer'
import { useCallback } from './useCallback'
import { useEffect } from './useEffect'
import { useState } from './useState'

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

  it('works with directive event binding', async () => {
    const callback = vi.fn((evt: Event) => {
      expect(evt).toBeDefined()
      expect(evt).toBeInstanceOf(Event)
    })

    const onMouseClick = useCallback(callback)

    const { queryByRole, unmount } = render(() => (
      // @ts-ignore
      <button role={"button"} on:click={onMouseClick}></button>
    ))
    const button = (await queryByRole('button')) as HTMLButtonElement
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(callback).toBeCalledTimes(1)
    unmount()
  })

  it('works with directive event binding in capture phase', async () => {
    const callback = vi.fn((evt: Event) => {
      expect(evt).toBeDefined()
      expect(evt).toBeInstanceOf(Event)
    })

    const onMouseClick = useCallback(callback)

    const { queryByRole, unmount } = render(() => (
      // @ts-ignore
      <button role={"button"} oncapture:click={onMouseClick}></button>
    ))
    const button = (await queryByRole('button')) as HTMLButtonElement
    expect(button).toBeInTheDocument()
    fireEvent.click(button)
    expect(callback).toBeCalledTimes(1)
    unmount()
  })

  it('handles reactivity with owner context signals', async () => {
    const initialNumber = 345
    let callback: Mock
    const { queryByRole, unmount } = render(() => {
      const [randomNumber, setRandomNumber] = useState(initialNumber)

      callback = vi.fn((evt: Event) => {
        expect(evt).toBeDefined()
        expect(evt).toBeInstanceOf(Event)

        // test if the value changed
        expect(randomNumber()).not.toEqual(initialNumber)
      })

      // produce a new number every 5ms
      const randomNumberProducer = useStateProducer<number>((set) => {
        const t = setInterval(() => set(Math.random() * 1000), 5);
        return () => clearInterval(t);
      })

      // sync with randomNumber state every 5 ms
      useEffect(() => {
        setRandomNumber(randomNumberProducer())
      })

      return (
        <button role={"button"} onClick={useCallback(callback)}></button>
      )
    })
    const button = (await queryByRole('button')) as HTMLButtonElement
    expect(button).toBeInTheDocument()

    // wait for 100ms
    await useWait(100)

    fireEvent.click(button)
    expect(callback).toBeCalledTimes(1)
    unmount()
  })
})
