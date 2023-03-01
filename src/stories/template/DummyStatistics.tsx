import React, { FunctionComponent, useEffect } from 'react'
import { useDummy } from './store/dummyStore'

export type DummyStatisticsProps = any

const DummyStatistics: FunctionComponent<DummyStatisticsProps> = () => {
  const multiply = useDummy((state) => (
    state.state.statistics.multiply
  ))
  const divide = useDummy((state) => (
    state.state.statistics.divide
  ))

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('CHANGE: DummyStatistics', multiply, divide)
  }, [ multiply, divide ])

  console.log('RENDER: DummyStatistics', multiply, divide)
  /* eslint-enable no-console */

  return (
    <div>
      <h3>Statistics</h3>
      <div>multiply: { multiply }</div>
      <div>divide: { divide }</div>
    </div>
  )
}

export default DummyStatistics
