# Overscope: Hooks over Contexts state-management toolkit for React

Convenience. Speed. Flexibility.

If you want to organize state management in your React application in a modern way, while maintaining flexibility and usability, then this package is for you.

## Hooks over Context approach

Why should you choose the hooks + contexts approach? 

This approach allows you to easily and quickly organize independent and local state management at the level of a separate branch of the component tree with complete state isolation. 

In simple terms: you can place several identical components on the page and their states will not overlap.

### Problems of this approach

However, this approach has 2 significant problems:
1. **performance** - any update of the context value will update absolutely all components using this context;
2. **boilerplate** - leads to the appearance of a large amount of boilerplate and essentially unnecessary code.

This package solves these problems.

## Installation

Install stable version using:

```shell
npm install overscope
```

```shell
yarn add overscope
```

## Introduction

To solve the problems of the original (contexts + hooks) approach, a set of tools was created, including: 
- Tools for working with contexts; 
- Tools for working with state;
- Tools for working with transform (reducers).

## Advantages

Substantial advantages over the original (contexts + hooks) approach and other toolkits:

### 1. Partiality
The toolkit includes separate solutions for working with contexts and states, they can be used both together and separately.

### 2. Separated state from transform (reducers)
The state and transform are stored separately, which allows you to always understand what kind of data was extracted from the store.

### 3. Immer
The built-in immer allows you to update state using a mutable approach without deviating from the immutable data paradigm.

### 4. Selectors
Selectors allow you to extract data from the store, and only this data will affect the update of the component.

### 5. Lightweight
Package size does not exceed 40 kb.

## Disadvantages
TBD

## Usage

1. Working with data scheme:

If you are using `typescript` you should describe the state and transform types like this:
```tsx
// State (only value)
export type DummyState = {
  count: number,
}

// Reducers (aka Transform object)
export type DummyTransform = {
  increase: () => void,
  multiply: (multiplier: number) => void,
}
```

2. Working with contexts:

Use a context factory and specify the types created earlier.

The factory returns a tuple, the first element of which is the context provider, the second element is a hook for extracting data from the store.
```tsx
export const [ DummyProvider, useDummy ] = overscopeContext<DummyState, DummyTransform>()
```

3. Working with data:

Form the state using the usual `useState` hook with the previously created type

And also describe the transform (list of reducers) using the `useTransform` hook from the toolbox.
Remember: another powerful `immer` tool is used inside, use it to the fullest!
```tsx
const [ state, setState ] = useState<DummyState>({
  count: initial,
})

const transform = useTransform<DummyState, DummyTransform>(setState, (patch) => ({
  increase: () => patch((current) => {
    current.count++
  }),
  multiply: (multiplier) => patch((current) => {
    current.count *= multiplier
  }),
}))
```

4. Working with extraction:

Form the state using the usual `useState` hook with the previously created type.

And also describe the transform (list of reducers) using the `useTransform` hook from the toolkit.
Remember: another powerful `immer` tool is used inside, use it to the fullest!
```tsx
const count = useDummy((value) => value.state.count)

const {
  increase,
  multiply,
} = useDummy((value) => value.transform)
```

## In comparison

With `Contexts + Hooks`:
```tsx
import { DummyState, DummyTransform } from './dummyTypes'
import { FunctionComponent, useCallback, useContext, useMemo, useState } from 'react'

export type DummyStore = DummyState & DummyTransform

export const DummyContext = createContext<DummyStore>({
  count: 0,

  statistics: {
    multiply: 0,
  },

  increase: () => {},
  multiply: () => {},
})

export const DummyProvider = DummyContext.Provider

export const useDummy = (): DummyState => (
  useContext(DummyContext)
)

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

With `overscope`:
```tsx
import { DummyState, DummyTransform } from './dummyTypes'
import { overscopeContext, useTransform } from 'overscopeContext'

export const [ DummyProvider, useDummy ] = overscopeContext<DummyState, DummyTransform>()

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

## Warning: Active development...

The package is under active development, each new version may contain breaking changes
