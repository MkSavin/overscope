import React, { FunctionComponent, useEffect } from 'react'
import { useDummy } from './store/dummyStore'

export type DummyViewProps = any

const DummyView: FunctionComponent<DummyViewProps> = () => {
  const count = useDummy((state) => state.state.count)

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('CHANGE: DummyView', count)
  }, [ count ])

  console.log('RENDER: DummyView', count)
  /* eslint-enable no-console */

  return (
    <h3>
      Count: { count }
    </h3>
  )
}

export default DummyView
