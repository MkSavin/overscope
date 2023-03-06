import React, { FC, useEffect } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render } from '@testing-library/react'
import { useTransform } from './useTransform'

type TestState = {
  count: number,
}

type TestTransform = {
  increase: () => void,
}

it('Store propagates provided state and transform', () => {
  const handleSetState = jest.fn()
  const handleUpdateState = (callback: any): void => {
    const oldState: TestState = {
      count: 0,
    }

    const newState = callback(oldState)
    handleSetState(newState)
  }

  const TestComponent: FC = () => {
    const transform = useTransform<TestState, TestTransform>(handleUpdateState, (patch) => ({
      increase: () => patch((current) => {
        current.count++
      }),
    }))

    useEffect(() => {
      transform.increase()
    }, [])

    return (
      <></>
    )
  }

  render(<TestComponent />)

  expect(handleSetState).toBeCalledWith({
    count: 1,
  })
})
