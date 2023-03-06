import { useMemo } from 'react'
import { OverscopeState, OverscopeStore, OverscopeTransform } from '../types'

export const useStoreMemo = (
  <
    State extends OverscopeState,
    Transform extends OverscopeTransform,
  >(state: State, transform: Transform): OverscopeStore<State, Transform> => (
    useMemo(() => ({
      state,
      transform,
    }), [ state, transform ])
  )
)
