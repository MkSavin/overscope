import React, {
  FC, ReactNode, useContext, useEffect, useMemo, useState,
} from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { render, screen, waitFor } from '@testing-library/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent } from '@storybook/testing-library'
import { act } from 'react-dom/test-utils'
import { overscopeContext } from './overscopeContext'

describe('Overscope factory', () => {
  // eslint-disable-next-line no-console
  const realError = console.error

  afterEach(() => {
    // eslint-disable-next-line no-console
    console.error = realError
  })

  it('Store factory results contents', () => {
    const store = overscopeContext()

    expect(store).toHaveLength(3)

    const [
      Provider = undefined,
      useStore = undefined,
      Context = undefined,
    ] = store

    expect(typeof Provider).toBe('function')
    expect(typeof useStore).toBe('function')
    expect(typeof Context).toBe('object')
  })

  it('Store propagates default observer API', () => {
    const [ ,, Context ] = overscopeContext({
      state: {
        contents: 'test',
      },
      transform: {},
    })

    const TestComponent: FC = () => {
      const {
        storeRef,
        listen,
      } = useContext(Context)

      return (
        <>
          <div>
            State contents is { storeRef.current?.state.contents }
          </div>
          <div>
            Listen is {typeof listen}
          </div>
        </>
      )
    }

    render(<TestComponent />)

    expect(screen.getByText(/^State contents is/).textContent).toBe(
      'State contents is test',
    )
    expect(screen.getByText(/^Listen is/).textContent).toBe(
      'Listen is function',
    )
  })

  it('Hook throws OverscopeNoContextError', () => {
    const [ , useStore ] = overscopeContext()

    const TestComponent: FC = () => {
      useStore((store) => store)

      return (
        <></>
      )
    }

    // eslint-disable-next-line no-console
    console.error = jest.fn()

    try {
      expect(() => render(<TestComponent />))
        .toThrow('Empty store has been provided in overscope context')
    } catch { /* empty */ }
  })

  it('Store propagates provided state and transform', () => {
    const [ Provider,, Context ] = overscopeContext({
      state: {
        contents: 'test',
      },
      transform: {},
    })

    const TestComponent: FC = () => {
      const {
        storeRef,
        listen,
      } = useContext(Context)

      return (
        <>
          <div>
            State contents is { storeRef.current?.state.contents }
          </div>
          <div>
            Listen is { typeof listen }
          </div>
        </>
      )
    }

    const WrapperComponent: FC<{ children: ReactNode }> = (props) => {
      const {
        children,
      } = props

      const state = {
        contents: 'new test',
      }

      const transform = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        hello: () => {},
      }

      return (
        <Provider state={ state } transform={ transform }>
          { children }
        </Provider>
      )
    }

    render(
      <WrapperComponent>
        <TestComponent />
      </WrapperComponent>,
    )

    expect(screen.getByText(/^State contents is/).textContent).toBe(
      'State contents is new test',
    )
    expect(screen.getByText(/^Listen is/).textContent).toBe(
      'Listen is function',
    )
  })

  it('Hook provides proper store information', async () => {
    const handleClick = jest.fn()
    const handleListen = jest.fn()

    const [ Provider, useStore, Context ] = overscopeContext({
      state: {
        contents: 'test',
      },
      transform: {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        hello: () => {},
      },
    })

    const TestComponent: FC = () => {
      const {
        state,
        transform,
      } = useStore((store) => store)

      const {
        listen,
      } = useContext(Context)

      useEffect(() => (
        listen(handleListen)
      ), [])

      return (
        <>
          <button
            type="button"
            onClick={ transform.hello }
          >
            Click me
          </button>
          <div>
            State contents is { state.contents }
          </div>
          <div>
            Hello is { typeof transform.hello }
          </div>
        </>
      )
    }

    const WrapperComponent: FC<{ children: ReactNode }> = (props) => {
      const {
        children,
      } = props

      const [ state, setState ] = useState({
        contents: 'new test',
      })

      const transform = useMemo(() => ({
        hello: () => {
          act(() => {
            setState({
              contents: 'hello its me',
            })
          })
          handleClick()
        },
      }), [])

      return (
        <Provider state={ state } transform={ transform }>
          { children }
        </Provider>
      )
    }

    render(
      <WrapperComponent>
        <TestComponent />
      </WrapperComponent>,
    )

    expect(screen.getByText(/^State contents is/).textContent).toBe(
      'State contents is new test',
    )
    expect(screen.getByText(/^Hello is/).textContent).toBe(
      'Hello is function',
    )

    expect(handleListen).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByText(/click me/i))

    expect(handleClick).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(handleListen).toHaveBeenCalledTimes(2)

      expect(screen.getByText(/^State contents is/).textContent).toBe(
        'State contents is hello its me',
      )
      expect(screen.getByText(/^Hello is/).textContent).toBe(
        'Hello is function',
      )
    })
  })
})
