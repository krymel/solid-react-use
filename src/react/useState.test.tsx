import { render } from '@solidjs/testing-library'
import { useWait } from '~/time/useWait'
import { useEffect } from './useEffect'
import { useState } from './useState'

describe('useState', () => {

  it('can manage state and state changes in a reactive manner', async () => {

    let calls = 0
    let states: Array<number> = []

    const { unmount } = render(() => {

      const [s, setS] = useState(1)

      // initial first call happens
      useEffect(() => {
        states.push(s())
        calls++
      })

      const subscriptionId = setInterval(() => {
        if (calls === 5) {
          clearInterval(subscriptionId)
        }
        // called 3 more times
        setS(calls + 1)
      }, 2)

      return (<></>)
    })

    await useWait(20)

    expect(calls).toEqual(6)
    expect(states).toEqual([1, 2, 3, 4, 5, 6])

    unmount()
  })

  it('can manage state and state changes and trigger signal reads despite values are the same', async () => {

    let calls = 0
    let states: Array<number> = []

    const { unmount } = render(() => {

      const [s, setS] = useState(1, { equals: false })

      // initial first call happens
      useEffect(() => {
        states.push(s())
        calls++
      })

      const subscriptionId = setInterval(() => {
        if (calls === 5) {
          clearInterval(subscriptionId)
        }
        // called 3 more times, but always with the same value
        // however, it doesn't equal, so it would lead to signal flickering anyway
        setS(1)
      }, 2)

      return (<></>)
    })

    await useWait(20)

    expect(calls).toEqual(6)
    expect(states).toEqual([1, 1, 1, 1, 1, 1])

    unmount()
  })

  it('can manage state and state changes and do not trigger signal reads because values are the same', async () => {

    let calls = 0
    let states: Array<number> = []

    const { unmount } = render(() => {

      const [s, setS] = useState(1)

      // initial first call happens
      useEffect(() => {
        states.push(s())
        calls++
      })

      const subscriptionId = setInterval(() => {
        if (calls === 5) {
          clearInterval(subscriptionId)
        }
        // called 3 more times, but always with the same value
        // however, it doesn't equal, so it would lead to signal flickering anyway
        setS(1)
      }, 2)

      return (<></>)
    })

    await useWait(20)

    expect(calls).toEqual(1)
    expect(states).toEqual([1])

    unmount()
  })

  it('can manage state and state changes and use a custom equals() comparator', async () => {

    let calls = 0
    let states: Array<number> = []

    const { unmount } = render(() => {

      const [s, setS] = useState<number>(1, { equals: (prev, next) => {
        // intentionally using == here, see below
        return prev == next
      }
    })

      // initial first call happens
      useEffect(() => {
        states.push(s())
        calls++
      })

      const subscriptionId = setInterval(() => {
        if (calls === 5) {
          clearInterval(subscriptionId)
        }
        // called 3 more times, but always with the same value
        // however, this time, we break the contract and set strings
        // but as the custom comparator is using == instead of ===
        // there is no type check and it treats it as the same value
        setS('1' as any)
      }, 2)

      return (<></>)
    })

    await useWait(20)

    expect(calls).toEqual(1)
    expect(states).toEqual([1])

    unmount()
  })
})
