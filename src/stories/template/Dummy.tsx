import React, { FunctionComponent } from 'react'
import DummyView from './DummyView'
import DummyActions from './DummyActions'
import DummyBlock from './DummyBlock'
import DummyStatistics from './DummyStatistics'

export type DummyProps = any

const Dummy: FunctionComponent<DummyProps> = () => (
  <DummyBlock>
    <DummyView />
    <DummyActions />
    <hr />
    {/* <DummyView />
    <DummyActions />
    <hr /> */}
    <DummyStatistics />
  </DummyBlock>
)

export default Dummy
