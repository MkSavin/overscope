import React, {
  FunctionComponent, ReactNode, useEffect, useState,
} from 'react'
import { useTransform } from '../../hooks/useTransform'
import { DummyProvider } from './store/dummyStore'
import { DummyState, DummyTransform } from './types/dummyTypes'

export type DummyBlockProps = {
  initial?: number,
  children: ReactNode,
}

const DummyBlock: FunctionComponent<DummyBlockProps> = (props) => {
  const {
    initial = 0,
    children,
  } = props

  const [ state, setState ] = useState<DummyState>({
    count: initial,

    statistics: {
      multiply: 0,
      divide: 0,
    },
  })

  const transform = useTransform<DummyState, DummyTransform>(setState, (patch) => ({
    increase: () => patch((current) => {
      current.count++
    }),
    decrease: () => patch((current) => {
      current.count--
    }),
    set: (value: number) => patch((current) => {
      current.count = value
    }),
    multiply: (value: number) => patch((current) => {
      current.count *= value
      current.statistics.multiply++
    }),
    divide: (value: number) => patch((current) => {
      current.count /= value
      current.statistics.divide++
    }),
    add: (value: number) => patch((current) => {
      current.count += value
    }),
    subtract: (value: number) => patch((current) => {
      current.count -= value
    }),
  }))

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('CHANGE: DummyBlock', state)
  }, [ state ])

  console.log('RENDER: DummyBlock')
  /* eslint-enable no-console */

  return (
    <DummyProvider state={ state } transform={ transform }>
      { children }
    </DummyProvider>
  )
}

export default DummyBlock
