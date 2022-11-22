import { render } from '@solidjs/testing-library'
import { useWait } from '~/time/useWait'
import { useEffect, useInsertionEffect, useLayoutEffect } from './useEffect'
import { useState } from './useState'

describe('useEffect', () => {

  it('runs an effect in case of signals are read', async () => {

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
        if (calls === 3) {
          clearInterval(subscriptionId)
        }
        // called 3 more times
        setS(calls + 1)
      }, 2)
      return (<></>)
    })

    await useWait(20)

    expect(calls).toEqual(4)
    expect(states).toEqual([1, 2, 3, 4])
    unmount()
  })

  it('runs a layout effect always when signals are read', async () => {

    let calls = 0
    let states: Array<number> = []

    const { unmount } = render(() => {

      const [s, setS] = useState(1)

      // initial first call happens
      useLayoutEffect(() => {
        states.push(s())
        calls++
      })

      const subscriptionId = setInterval(() => {
        if (calls === 3) {
          clearInterval(subscriptionId)
        }
        // called 3 more times
        setS(calls + 1)
      }, 2)
      return (<></>)
    })

    await useWait(20)

    expect(calls).toEqual(4)
    expect(states).toEqual([1, 2, 3, 4])
    unmount()
  })

  it('runs a insertion effect always when signals are read', async () => {

    let calls = 0
    let states: Array<number> = []

    const { unmount } = render(() => {

      const [s, setS] = useState(1)

      // initial first call happens
      useInsertionEffect(() => {
        states.push(s())
        calls++
      })

      const subscriptionId = setInterval(() => {
        if (calls === 3) {
          clearInterval(subscriptionId)
        }
        // called 3 more times
        setS(calls + 1)
      }, 2)
      return (<></>)
    })

    await useWait(20)

    expect(calls).toEqual(4)
    expect(states).toEqual([1, 2, 3, 4])
    unmount()
  })
})
