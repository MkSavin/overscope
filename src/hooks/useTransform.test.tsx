import React, { FC, useEffect, useState } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react'
import { useTransform } from './useTransform'

type TestState = {
  count: number,
}

type TestTransform = {
  increase: () => void,
  superFunction?: (number: number) => void,
}

type TestNestedTransform = {
  nested: {
    increase: () => void,
  },
}

describe('useTransform', () => {
  it('Modifies provided store', () => {
    const TestComponent: FC = () => {
      const [ state, setState ] = useState<TestState>({
        count: 0,
      })

      const transform = useTransform<TestState, TestTransform>(setState, (patch) => ({
        increase: () => patch((current) => {
          current.count++
        }),
      }))

      useEffect(() => {
        transform.increase()
      }, [])

      return (
        <>{ state.count }</>
      )
    }

    const { asFragment } = render((
      <TestComponent />
    ))

    expect(asFragment()).toMatchSnapshot()
  })

  it('Provides actual state reference', () => {
    const TestComponent: FC = () => {
      const [ state, setState ] = useState<TestState>({
        count: 1,
      })

      const transform = useTransform<TestState, TestTransform>(
        [ state, setState ],
        (patch, stateRef) => ({
          increase: () => {
            const outPatch = stateRef.current?.count ?? 0

            patch((current) => {
              current.count = outPatch + 1
            })
          },
        }),
      )

      useEffect(() => {
        transform.increase()
      }, [])

      return (
        <>{ state.count }</>
      )
    }

    const { asFragment } = render((
      <TestComponent />
    ))

    expect(asFragment()).toMatchSnapshot()
  })

  it('Executes event handlers', () => {
    const handleEvent = jest.fn()

    const TestComponent: FC = () => {
      const [ state, setState ] = useState<TestState>({
        count: 1,
      })

      const transform = useTransform<TestState, TestTransform>(
        [ state, setState ],
        (patch, stateRef) => ({
          increase: () => {
            const outPatch = stateRef.current?.count ?? 0

            patch((current) => {
              current.count = outPatch + 1
            })
          },

          _beforeEach: () => {
            const outPatch = stateRef.current?.count ?? 0

            handleEvent()

            patch((current) => {
              current.count = outPatch + 10
            })
          },

          _afterEach: () => {
            const outPatch = stateRef.current?.count ?? 0

            handleEvent()

            patch((current) => {
              current.count = outPatch * 2
            })
          },
        }),
      )

      useEffect(() => {
        transform.increase()
      }, [])

      return (
        <>{ state.count }</>
      )
    }

    const { asFragment } = render((
      <TestComponent />
    ))

    expect(asFragment()).toMatchSnapshot()

    expect(handleEvent).toBeCalledTimes(2)
  })

  it('Do not executes event handlers for nested callbacks', () => {
    const handleEvent = jest.fn()

    const TestComponent: FC = () => {
      const [ state, setState ] = useState<TestState>({
        count: 1,
      })

      const transform = useTransform<TestState, TestNestedTransform>(
        [ state, setState ],
        (patch, stateRef) => ({
          nested: {
            increase: () => {
              const outPatch = stateRef.current?.count ?? 0

              patch((current) => {
                current.count = outPatch + 1
              })
            },
          },

          _beforeEach: () => {
            const outPatch = stateRef.current?.count ?? 0

            handleEvent()

            patch((current) => {
              current.count = outPatch + 10
            })
          },

          _afterEach: () => {
            const outPatch = stateRef.current?.count ?? 0

            handleEvent()

            patch((current) => {
              current.count = outPatch * 2
            })
          },
        }),
      )

      useEffect(() => {
        transform.nested.increase()
      }, [])

      return (
        <>{ state.count }</>
      )
    }

    const { asFragment } = render((
      <TestComponent />
    ))

    expect(asFragment()).toMatchSnapshot()

    expect(handleEvent).toBeCalledTimes(0)
  })
})
