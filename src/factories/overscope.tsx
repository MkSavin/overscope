import React, {
  createContext, useContext, useEffect, useMemo, useRef, useState,
} from 'react'
import fastEqual from 'fast-deep-equal'
import {
  OverscopeConsumer,
  OverscopeContextListener,
  OverscopeObserverState,
  OverscopeProviderComponent,
  OverscopeProviderProperties,
  OverscopeState,
  OverscopeStore,
  OverscopeTransform,
  OverscopeTuple,
} from '../types'
import { OverscopeEmptyStoreError } from '../errors/OverscopeEmptyStoreError'
import { useStoreMemo } from '../hooks/useStoreMemo'

export const overscope = (
  <
    State extends OverscopeState,
    Transform extends OverscopeTransform,
  >(
    initial?: OverscopeStore<State, Transform>,
  ): OverscopeTuple<State, Transform> => {
    const ObserverContext = createContext<OverscopeObserverState<State, Transform>>({
      storeRef: { current: initial },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      listen: () => () => {},
      default: true,
    })

    const Provider: OverscopeProviderComponent<State, Transform> = (
      // Re-specifying to workaround eslint errors
      props: OverscopeProviderProperties<State, Transform>,
    ) => {
      const {
        state,
        transform,
        children,
      } = props

      const store = useStoreMemo(state, transform)

      const storeRef = useRef(store)
      storeRef.current = store

      const listenersRef = useRef(new Set<OverscopeContextListener<State, Transform>>())

      const context: OverscopeObserverState<State, Transform> = useMemo(() => ({
        storeRef,
        listen: (listener) => {
          listenersRef.current.add(listener)

          return () => {
            listenersRef.current.delete(listener)
          }
        },
        default: false,
      }), [])

      useEffect(() => {
        listenersRef.current.forEach((listener) => {
          listener(store)
        })
      }, [ state, transform ])

      return (
        <ObserverContext.Provider value={ context }>
          { children }
        </ObserverContext.Provider>
      )
    }

    const useConsumer: OverscopeConsumer<State, Transform> = (
      selector,
      equal = fastEqual,
    ) => {
      const observerState = useContext(ObserverContext)

      const {
        storeRef,
        listen,
      } = observerState

      if (!storeRef.current) {
        throw new OverscopeEmptyStoreError(ObserverContext)
      }

      const selectorRef = useRef(selector)
      selectorRef.current = selector

      const [
        selected,
        setSelected,
      ] = useState<ReturnType<typeof selector>>(
        selector(storeRef.current),
      )

      const lastSelectedRef = useRef(selected)
      lastSelectedRef.current = selected

      useEffect(() => (
        listen((nextValue) => {
          const selectedNextValue = selectorRef.current(nextValue)

          if (!equal(selectedNextValue, lastSelectedRef.current)) {
            lastSelectedRef.current = selectedNextValue
            setSelected(lastSelectedRef.current)
          }
        })
      ), [ listen ])

      return selected
    }

    return [
      Provider,
      useConsumer,
      ObserverContext,
    ]
  }
)
