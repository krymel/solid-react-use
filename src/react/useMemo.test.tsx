import { render } from '@solidjs/testing-library'
import { useWait } from '~/time/useWait'
import { useEffect } from './useEffect'
import { useMemo } from './useMemo'
import { useState } from './useState'

describe('useMemo', () => {

  const fibonacci = (num: number) => num <= 1 ? 1 : fibonacci(num - 1) + fibonacci(num - 2)

  it('stores a value without re-computation when signals does not change', async () => {

    let calls = 0
    let fibCalls = 0
    let states: Array<number> = []
    let fibs: Array<number> = []

    const { unmount } = render(() => {

      const [s, setS] = useState(1)

      // initial first call happens
      useEffect(() => {
        states.push(s())
        calls++
      })

      const fib = useMemo<number>(() => {
        const nextFib = fibonacci(s())
        fibs.push(nextFib)
        fibCalls++
        return nextFib
      });

      const subscriptionId = setInterval(() => {
        if (calls === 5) {
          clearInterval(subscriptionId)
        }
        // called 3 more times
        setS(calls + 1)
      }, 2)

      return (<> {
        /* would have been 10 computation, but with useMemo,
           the signal never changes until setS() changes its value,
           which triggers Solid to re-compute the memo function and
           yield a new number which flickers the fib() signal  */}
        <div>1. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
        <div>2. {fib()} {fib()} {fib()} {fib()} {fib()}</div>
      </>)
    })

    await useWait(20)

    expect(calls).toEqual(6)
    expect(fibCalls).toEqual(6)
    expect(states).toEqual([1, 2, 3, 4, 5, 6])
    expect(fibs).toEqual([1, 2, 3, 5, 8, 13])

    unmount()
  })
})
