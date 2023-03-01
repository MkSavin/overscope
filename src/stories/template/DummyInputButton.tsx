import React, {
  ButtonHTMLAttributes, ChangeEventHandler, FunctionComponent, useCallback, useRef, useState,
} from 'react'

export type DummyButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onSubmit'> & {
  initialValue?: number,
  onSubmit?: (number: number) => void,
}

const DummyButton: FunctionComponent<DummyButtonProps> = (props) => {
  const {
    initialValue,
    onSubmit,
    ...buttonProps
  } = props

  const [ value, setValue ] = useState(initialValue ?? 0)

  const valueRef = useRef(value)
  valueRef.current = value

  const changeValue: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setValue(Number(event.target.value))
  }, [])

  const submit = useCallback(() => {
    onSubmit?.(valueRef.current)
  }, [ onSubmit ])

  return (
    <>
      <input
        value={ value }
        onChange={ changeValue }
      />
      <button
        type="button"
        { ...buttonProps }
        onClick={ submit }
      />
    </>
  )
}

export default DummyButton
