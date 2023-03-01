import {
  Context,
  MutableRefObject,
  ReactElement,
  ReactNode,
} from 'react'

/**
 * State value
 */
export type OverscopeState = Record<string, any>

/**
 * State reducer
 */
export type OverscopeReducer = (...args: any[]) => void

/**
 * State reducers list
 */
export type OverscopeTransform = Record<string, OverscopeReducer>

/**
 * State storage
 */
export type OverscopeStore<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = {
  state: State,
  transform: Transform,
}

/**
 * Store context provider properties
 */
export type OverscopeProviderProperties<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = {
  state: State,
  transform: Transform,
  children: ReactNode,
}

/**
 * Store context provider
 */
export type OverscopeProviderComponent<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = (
  props: OverscopeProviderProperties<State, Transform>,
) => ReactElement<any, any>|null

/**
 * Observer context subscribe function (listen)
 */
export type OverscopeContextListener<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = (store: OverscopeStore<State, Transform>) => void

/**
 * Observer context unsubscribe function (muffle)
 */
export type OverscopeContextMuffler = () => void

/**
 * Observer context state.
 * Contains listener registration function and most recent store value
 */
export type OverscopeObserverState<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = {
  storeRef: MutableRefObject<OverscopeStore<State, Transform>|undefined>,
  listen: (listener: OverscopeContextListener<State, Transform>) => OverscopeContextMuffler
}

/**
 * Observer context
 */
export type OverscopeObserverContext<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = Context<OverscopeObserverState<State, Transform>>

/**
 * Data consumer equality check function
 */
export type OverscopeEqualityCheck<Selected> = (a: Selected, b: Selected) => boolean

/**
 * Linear consumer for context
 */
export type OverscopeConsumer<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = <Selected>(
  selector: (value: OverscopeStore<State, Transform>) => Selected,
  equality?: OverscopeEqualityCheck<Selected>,
) => Selected

/**
 * Overscope result tuple
 */
export type OverscopeTuple<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = [
  OverscopeProviderComponent<State, Transform>,
  OverscopeConsumer<State, Transform>,
  OverscopeObserverContext<State, Transform>,
]

/**
 * State setter declaration
 */
export type OverscopeSetter<
  State extends OverscopeState
> = (callback: (value: State) => State) => void

/**
 * State patcher. Transmits immer draft of state value
 */
export type OverscopePatch<
  State extends OverscopeState
> = (callback: (value: State) => State|void) => void

/**
 * State reducers declarator
 */
export type OverscopeTransformer<
  State extends OverscopeState,
  Transform extends OverscopeTransform
> = (
  patch: OverscopePatch<State>,
) => Transform
