import { overscope } from '../../../factories/overscope'
import { DummyState, DummyTransform } from '../types/dummyTypes'

export const [ DummyProvider, useDummy ] = overscope<DummyState, DummyTransform>()
