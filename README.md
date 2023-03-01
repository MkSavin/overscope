# Overscope Hooks over Contexts state-management for React

Convenience. Speed. Flexibility.

If you want to organize state management in your react application in a modern way, while maintaining flexibility and usability, then this package is for you

## Contexts + Hooks approach

Why should you choose the contexts + hooks approach? 

This approach allows you to easily and quickly organize independent and local state management at the level of a separate branch of the component tree with complete state isolation. 

In simple terms: you can place several identical components on the page and their states will not overlap.

### Problems

However, this approach has 2 significant problems:
1. **performance** - any update of the context value will update absolutely all components using this context;
2. **boilerplate** - leads to the appearance of a large amount of boilerplate and essentially unnecessary code.

This package solves these problems.

## Introduction

## Advantages

### Separated value from reducers
### Immer
### Selectors

## Disadvantages

## Usage

## API

## In comparison

Default Contexts + Hooks:

```tsx
import { DummyState, DummyTransform } from './dummyTypes'
import { FunctionComponent, useCallback, useContext, useMemo, useState } from 'react'

export type DummyStore = DummyState & DummyTransform

export const DummyContext = createCotnext<DummyStore>({
  count: 0,

  statistics: {
    multiply: 0,
  },

  increase: () => {},
  multiply: () => {},
})

export const DummyProvider = DummyContext.Provider

export const useDummy = (): DummyState => {
  useContext(DummyContext)
}

export const DummyWorker: FunctionComponent<any> = () => {
  const {
    count,
    statistics,
    increase,
    multiply,
  } = useContext(DummyContext)
  
  const multiplyClick = useCallback(() => {
    multiply(5)
  }, [])
  
  return (
    <div>
      <div>{ count }</div>
      <div>{ statistics.multiply }</div>
      <button type="button" onClick={ increase }>Increase</button>
      <button type="button" onClick={ multiplyClick }>Multiply</button>
    </div>
  )
}

export const DummyBlock: FunctionComponent<any> = () => {
  const [ state, setState ] = useState<DummyState>({
    count: initial,

    statistics: {
      multiply: 0,
    },
  })

  const increase = useCallback(() => {
    setState((old) => ({
      ...old,
      count: old.count + 1,
    }))
  }, [])

  const multiply = useCallback((amount: number) => {
    setState((old) => ({
      ...old,
      count: old.count * amount,
      statistics: {
        ...old.statistics,
        multiply: old.statistics.multiply + 1,
      },
    }))
  }, [])

  const contextState = useMemo(() => ({
    ...state,
    increase,
    multiply,
  }), [ state, increase, multiply ])

  return (
    <DummyProvider value={ contextState }>
      <DummyWorker />
    </DummyProvider>
  )
}
```

```tsx
import { DummyState, DummyTransform } from './dummyTypes'
import { overscope, useTransform } from 'overscope'

export const [ DummyProvider, useDummy ] = overscope<DummyState, DummyTransform>()

export const DummyWorker: FunctionComponent<any> = () => {
  const {
    count,
    statistics,
  } = useDummy((value) => value.state)

  const {
    increase,
    multiply,
  } = useDummy((value) => value.transform)

  const multiplyClick = useCallback(() => {
    multiply(5)
  }, [])

  return (
    <div>
      <div>{ count }</div>
      <div>{ statistics.multiply }</div>
      <button type="button" onClick={ increase }>Increase</button>
      <button type="button" onClick={ multiplyClick }>Multiply</button>
    </div>
  )
}

export const DummyBlock: FunctionComponent<any> = () => {
  const [ state, setState ] = useState<DummyState>({
    count: initial,

    statistics: {
      multiply: 0,
    },
  })

  const transform = useTransform<DummyState, DummyTransform>(setState, (patch) => ({
    increase: () => patch((current) => {
      current.count++
    }),
    multiply: (value: number) => patch((current) => {
      current.count *= value
      current.statistics.multiply++
    }),
  }))
  
  return (
    <DummyProvider state={ state } transform={ transform }>
      <DummyWorker/>
    </DummyProvider>
  )
}
```
