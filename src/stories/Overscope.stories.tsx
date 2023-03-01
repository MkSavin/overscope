import React from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { ComponentStory, ComponentMeta } from '@storybook/react'
import Dummy from './template/Dummy'

export default {
  title: 'General',
  component: Dummy,
} as ComponentMeta<typeof Dummy>

const Template: ComponentStory<typeof Dummy> = (args) => (
  <Dummy
    { ...args }
  />
)

export const Primary = Template.bind({})

Primary.args = {
}
