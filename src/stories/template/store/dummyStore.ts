import { overscopeContext } from '../../../factories/overscopeContext'
import { DummyState, DummyTransform } from '../types/dummyTypes'

export const [ DummyProvider, useDummy ] = overscopeContext<DummyState, DummyTransform>()
