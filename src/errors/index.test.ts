import { createContext } from 'react'
import { OverscopeEmptyStoreError } from './OverscopeEmptyStoreError'

it('Errors returns default messages', () => {
  const emptyStoreError = new OverscopeEmptyStoreError()

  expect(emptyStoreError.message).toBe('Empty store has been provided in overscope context')
})

it('Errors with not named context returns default messages', () => {
  const context = createContext({})

  const emptyStoreError = new OverscopeEmptyStoreError(context)

  expect(emptyStoreError.message).toBe('Empty store has been provided in overscope context')
})

it('Errors with named context returns proper messages', () => {
  const context = createContext({})
  context.displayName = 'Some Context'

  const emptyStoreError = new OverscopeEmptyStoreError(context)

  expect(emptyStoreError.message).toBe('Empty store has been provided in Some Context')
})
