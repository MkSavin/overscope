import React, { FC } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen } from '@testing-library/react'
import { useStoreMemo } from './useStoreMemo'

type TestState = {
  count: number,
}

type TestTransform = {
  increase: () => void,
}

type TestComponentProps = {
  state: TestState,
  transform: TestTransform,
}

it('Store Memo returns store object', () => {
  const state: TestState = {
    count: 0,
  }

  const transform: TestTransform = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    increase: () => {},
  }

  const TestComponent: FC<TestComponentProps> = (props) => {
    const {
      state: innerState,
      transform: innerTransform,
    } = props

    const store = useStoreMemo(innerState, innerTransform)

    return (
      <>
        <div>
          Store is { typeof store }
        </div>
        <div>
          Count is { store.state.count }
        </div>
        <div>
          Increase is { typeof store.transform.increase }
        </div>
      </>
    )
  }

  render(<TestComponent state={ state } transform={ transform } />)

  expect(screen.getByText(/^Store is/).textContent).toBe(
    'Store is object',
  )
  expect(screen.getByText(/^Count is/).textContent).toBe(
    'Count is 0',
  )
  expect(screen.getByText(/^Increase is/).textContent).toBe(
    'Increase is function',
  )
})
