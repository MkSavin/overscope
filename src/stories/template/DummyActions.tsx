import React, { FunctionComponent, useEffect } from 'react'
import { useDummy } from './store/dummyStore'
import DummyButton from './DummyButton'
import DummyInputButton from './DummyInputButton'

export type DummyActionsProps = any

const DummyActions: FunctionComponent<DummyActionsProps> = () => {
  const {
    increase,
    decrease,
    set,
    multiply,
    divide,
    add,
    subtract,
  } = useDummy((state) => state.transform)

  /* eslint-disable no-console */
  useEffect(() => {
    console.log('CHANGE: DummyActions')
  }, [ multiply ])

  console.log('RENDER: DummyActions')
  /* eslint-enable no-console */

  return (
    <div>
      <h3>Actions</h3>
      <div>
        <DummyButton
          onClick={ increase }
        >
          Increase
        </DummyButton>
      </div>
      <div>
        <DummyButton
          onClick={ decrease }
        >
          Decrease
        </DummyButton>
      </div>
      <div>
        <DummyInputButton
          initialValue={ 1 }
          onSubmit={ set }
        >
          Set
        </DummyInputButton>
      </div>
      <div>
        <DummyInputButton
          initialValue={ 2 }
          onSubmit={ multiply }
        >
          Multiply
        </DummyInputButton>
      </div>
      <div>
        <DummyInputButton
          initialValue={ 2 }
          onSubmit={ divide }
        >
          Divide
        </DummyInputButton>
      </div>
      <div>
        <DummyInputButton
          initialValue={ 1 }
          onSubmit={ add }
        >
          Add
        </DummyInputButton>
      </div>
      <div>
        <DummyInputButton
          initialValue={ 1 }
          onSubmit={ subtract }
        >
          Subtract
        </DummyInputButton>
      </div>
    </div>
  )
}

export default DummyActions
