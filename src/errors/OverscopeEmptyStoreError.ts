import { Context } from 'react'

export class OverscopeEmptyStoreError extends Error {
  constructor(context?: Context<any>) {
    super()
    this.message = `Empty store has been provided in ${context?.displayName ?? 'overscope context'}`
  }
}
