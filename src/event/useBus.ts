import { useGlobal } from '../state/useGlobal'

export interface BusEvent<P> {
  eventId?: number
  payload: P
}

export type EventHandler<T, P> = (busEvent: BusEvent<P>, bus: Bus<T, P>) => void
export type SubscriberId = number

export interface Subscriber<T, E> {
  topic: T
  handler: EventHandler<T, E>
}
export type SubscriptionType = 'one-time' | 'continuous'

export type Action<Payload, ResponsePayload> = (payload: Payload) => Promise<ResponsePayload>

export interface Bus<T, P> {
  subscribers: Array<Subscriber<T, P> | undefined>
  on<EH extends EventHandler<T, P>>(topic: T, handler: EH): SubscriberId
  off(subscriberId: SubscriberId): void
  emit<EP extends BusEvent<P>>(topic: T, event: EP): void
}

const defaultBusName = '@@useBus'

export const useBus = <T, P>(name = defaultBusName): Bus<T, P> => {
  const [bus, setBus] = useGlobal<Bus<T, P>>(name)

  const _bus = bus()
  if (_bus) return _bus // singleton early return

  return setBus({
    subscribers: [],
    on: <EH extends EventHandler<T, P>>(topic: T, handler: EH) =>
      bus().subscribers.push({
        topic,
        handler,
      }) - 1,
    off: (subscriberIndex: number) => {
      bus().subscribers[subscriberIndex] = undefined
    },
    emit: <EP extends BusEvent<P>>(topic: T, event: EP) => {
      const _bus = bus()
      for (let i = 0; i < _bus.subscribers.length; i += 1) {
        if (
          _bus.subscribers &&
          // after unsubscribe, a handler can be undefined, need to check
          _bus.subscribers[i] &&
          _bus.subscribers[i].topic === topic
        ) {
          _bus.subscribers[i]!.handler(event as BusEvent<P>, _bus)
        }
      }
    },
  })
}

export const getResponseEventName = <BusEventNames>(eventName: BusEventNames): BusEventNames =>
  `${eventName}:response` as unknown as BusEventNames

export interface Subscription {
  unsubscribe: () => void
}

export const useBusSubscribe = <Payload = unknown, BusEventNames = string>(
  eventName: BusEventNames,
  eventHandler: EventHandler<BusEventNames, Payload>,
  subscriptionType: SubscriptionType = 'continuous',
  waitForEventId?: number,
): Subscription => {
  const bus = useBus<BusEventNames, Payload>()

  const subscriberId = bus.on(eventName, (handlerPayload, bus) => {
    if (subscriptionType === 'one-time') {
      if (typeof waitForEventId !== 'undefined' && handlerPayload.eventId === waitForEventId) {
        bus.off(subscriberId)
      } else {
        bus.off(subscriberId)
      }
    }
    return eventHandler(handlerPayload, bus)
  })

  return {
    unsubscribe: () => {
      bus.off(subscriberId)
    },
  }
}

export const useBusOn = <Payload = unknown, ResponsePayload = unknown, BusEventNames = string>(
  eventName: BusEventNames,
  action: Action<Payload, ResponsePayload>,
): Subscription => {
  const bus = useBus<BusEventNames, ResponsePayload>()

  // whenever an event $eventName is emitted on the bus,
  // we want to activate the handler registered here
  return useBusSubscribe<Payload, BusEventNames>(
    eventName,
    async (event: BusEvent<Payload>) => {
      // we respond with an event that announces a response to the
      // event we just catched
      bus.emit(getResponseEventName<BusEventNames>(eventName), {
        // therefore the action needs to be called and awaited
        payload: await action(event.payload),
        // make sure the event is the same as the one we've received
        // so that the receiver can map the response well
        eventId: event.eventId,
      })
    },
    'continuous',
  )
}

export const useBusEmit = async <Payload = unknown, ResponsePayload = unknown, BusEventNames = string>(
  eventName: BusEventNames,
  payload: Payload,
): Promise<ResponsePayload> => {
  return new Promise((resolve) => {
    const [eventId, setEventId] = useGlobal<number>('@@useBusCallActionEventId', 1)

    setEventId(eventId() + 1)

    const bus = useBus<BusEventNames, Payload>()

    // start listening for the response to the action event we will emit
    useBusSubscribe(
      getResponseEventName(eventName),
      (event: BusEvent<ResponsePayload>) => {
        // now we've got the response from the event action being
        // processed, so we can resolve the promise
        resolve(event.payload)
      },
      'one-time',
      eventId(),
    )

    // emit the event so that an action
    // registered via useBusAddAction is called
    bus.emit(eventName, {
      payload,
      eventId: eventId(),
    })
  })
}
