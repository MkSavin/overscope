import { useMemo, useRef } from 'react'
import { produce } from 'immer'
import {
  OverscopePatch, OverscopeSetter, OverscopeState, OverscopeTransform, OverscopeTransformer,
} from '../types'

/**
 * Create overscope transform object.
 *
 * @param stateHandle state setter or [ state, setter ].
 *   If `state` provided it used for initial value of `stateRef`.
 * @param transformer User-defined transform object
 */
export const useTransform = (
  <
    State extends OverscopeState,
    Transform extends OverscopeTransform,
  >(
    stateHandle: OverscopeSetter<State> | [ State, OverscopeSetter<State> ],
    transformer: OverscopeTransformer<State, Transform>,
  ): Transform => {
    const state = Array.isArray(stateHandle)
      ? stateHandle[0]
      : undefined

    const stateRef = useRef(state)
    stateRef.current = state

    const setter = Array.isArray(stateHandle)
      ? stateHandle[1]
      : stateHandle

    const setterRef = useRef(setter)
    setterRef.current = setter

    const patch: OverscopePatch<State> = (callback) => {
      setterRef.current((current) => {
        const modified = produce(current, callback)
        stateRef.current = modified
        return modified
      })
    }

    return useMemo(() => {
      const bareTransform = transformer(patch, stateRef)

      const beforeCallback = bareTransform._beforeEach
      const afterCallback = bareTransform._afterEach

      const richTransform = Object.entries(bareTransform)
        .filter(([ code ]) => code !== '_beforeEach' && code !== '_afterEach')
        .map(([ code, handle ]) => {
          if (typeof handle !== 'function') {
            return [ code, handle ]
          }

          return [
            code,
            (...data: any[]): void => {
              beforeCallback?.()
              handle(...data)
              afterCallback?.()
            },
          ]
        })

      return Object.fromEntries(richTransform)
    }, [])
  }
)
