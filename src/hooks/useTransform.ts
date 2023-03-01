import { useCallback, useMemo, useRef } from 'react'
import { produce } from 'immer'
import {
  OverscopePatch, OverscopeSetter, OverscopeState, OverscopeTransform, OverscopeTransformer, 
} from '../types'

export const useTransform = (
  <
    State extends OverscopeState,
    Transform extends OverscopeTransform,
  >(
    setter: OverscopeSetter<State>,
    transformer: OverscopeTransformer<State, Transform>,
  ): Transform => {
    const setterRef = useRef(setter)
    setterRef.current = setter

    const patch: OverscopePatch<State> = useCallback((callback) => {
      setterRef.current((state) => produce(state, callback))
    }, [])

    return useMemo(() => transformer(patch), [])
  }
)
