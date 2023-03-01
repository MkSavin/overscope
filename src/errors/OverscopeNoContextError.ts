import { Context } from 'react'

export class OverscopeNoContextError extends Error {
  constructor(context?: Context<any>) {
    super()
    this.message = `No ${context?.displayName ?? 'overscope context'} has been provided`
  }
}
