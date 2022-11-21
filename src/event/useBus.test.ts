import { vi } from 'vitest'
import { BusEvent, getResponseEventName, useBus, useBusEmit, useBusOn, useBusSubscribe } from './useBus'

describe('useBus', () => {
  const bus = useBus()

  it('is defined', () => {
    expect(bus).toBeDefined()
    expect(bus.emit).toBeDefined()
    expect(bus.on).toBeDefined()
    expect(bus.off).toBeDefined()
    expect(bus.subscribers).toBeDefined()
  })

  it('can emit on a topic and get called', () => {
    const onEventReceived = vi.fn(() => {})

    const bus = useBus<'chat:message', { arbitrary: string }>()

    bus.on('chat:message', onEventReceived)

    bus.emit('chat:message', {
      payload: { arbitrary: 'data' },
    })

    bus.emit('chat:message', {
      payload: { arbitrary: 'data' },
    })

    bus.emit('chat:message', {
      payload: { arbitrary: 'data' },
    })

    expect(onEventReceived).toHaveBeenCalledTimes(3)
  })

  it('can emit on a topic and unregister as well', () => {
    const onEventReceived = vi.fn(() => {})

    const subscriberId = bus.on('chat:message', onEventReceived)
    bus.off(subscriberId)

    bus.emit('chat:message', {
      payload: { arbitrary: 'data' },
    })

    bus.emit('chat:message', {
      payload: { arbitrary: 'data' },
    })

    bus.emit('chat:message', {
      payload: { arbitrary: 'data' },
    })

    expect(subscriberId).toBe(1)

    expect(onEventReceived).toHaveBeenCalledTimes(0)
  })

  interface MyCounter {
    counter: number
  }

  type ReturnValue = boolean

  it('generates a correct return channel event name', () => {
    expect(getResponseEventName('foo')).toEqual('foo:response')
  })

  it('can add a an action handler and emit an event to run it, process the result', async () => {
    const counterChangedHandler = vi.fn(async (payload: MyCounter) => {
      expect(payload.counter).toBe(1)
      return true
    })

    const subscription = useBusOn('counterChanged1', counterChangedHandler)

    const answer = await useBusEmit<MyCounter, ReturnValue>('counterChanged1', { counter: 1 })

    expect(answer).toBeDefined()
    expect(answer).toEqual(true)

    expect(counterChangedHandler).toHaveBeenCalledTimes(1)

    expect(subscription).toBeInstanceOf(Object)
    expect(subscription.unsubscribe).toBeInstanceOf(Function)
    expect(subscription.unsubscribe()).toBe(undefined)
  })

  it('can add a continuous mode subscriber to process events', async () => {
    const counterChangedHandler = vi.fn(async (event: BusEvent<MyCounter>) => {
      expect(event.payload.counter).toEqual(1)
      return true
    })

    const subscription = useBusSubscribe<MyCounter>('counterChanged2', counterChangedHandler, 'continuous')

    useBusEmit<MyCounter>('counterChanged2', { counter: 1 })
    useBusEmit('counterChanged2', { counter: 1 })

    expect(counterChangedHandler).toHaveBeenCalledTimes(2)

    expect(subscription).toBeInstanceOf(Object)
    expect(subscription.unsubscribe).toBeInstanceOf(Function)
    expect(subscription.unsubscribe()).toBe(undefined)
  })

  it('can add a one-time mode subscriber to process events', async () => {
    const counterChangedHandler = vi.fn(async (event: BusEvent<MyCounter>) => {
      expect(event.payload.counter).toEqual(1)
    })

    const subscription = useBusSubscribe<MyCounter>('counterChanged3', counterChangedHandler, 'one-time')

    useBusEmit('counterChanged3', { counter: 1 }) // processed
    useBusEmit('counterChanged3', { counter: 1 }) // unprocessed

    expect(counterChangedHandler).toHaveBeenCalledTimes(1)

    expect(subscription).toBeInstanceOf(Object)
    expect(subscription.unsubscribe).toBeInstanceOf(Function)
    expect(subscription.unsubscribe()).toBe(undefined)
  })

  it('can add a one- mode subscriber to process events', async () => {
    const counterChangedHandler = vi.fn(async (event: BusEvent<MyCounter>) => {
      expect(event.payload.counter).toEqual(1)
    })

    const subscription = useBusSubscribe<MyCounter>('counterChanged4', counterChangedHandler, 'continuous', 33)

    useBusEmit('counterChanged4', { counter: 1 })
    useBusEmit('counterChanged4', { counter: 1 })

    expect(counterChangedHandler).toHaveBeenCalledTimes(2)

    expect(subscription).toBeInstanceOf(Object)
    expect(subscription.unsubscribe).toBeInstanceOf(Function)
    expect(subscription.unsubscribe()).toBe(undefined)
  })
})
