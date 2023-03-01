import React, { ButtonHTMLAttributes, FunctionComponent } from 'react'

export type DummyButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

const DummyButton: FunctionComponent<DummyButtonProps> = (props) => (
  <button
    type="button"
    { ...props }
  />
)

export default DummyButton
