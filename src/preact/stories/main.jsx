/* eslint-disable react/jsx-key */
import { render } from 'preact'

import Storybook from './Storybook'

import { storyWithChildren } from '../utils/withChildren.stories'
import { storyAriaButton } from '../components/AriaButton.stories'
import { storyUseLocalState } from '../hooks/useLocalState.stories'

render(
  <Storybook stories={[
    <small>Components</small>,
    {
      titel: 'Button',
      component: () => <button onClick={() => alert('Hi')}>Click me</button>
    },
    storyAriaButton,
    <small>hooks</small>,
    storyUseLocalState,
    <small>utils</small>,
    storyWithChildren
  ]}/>,
  document.getElementById('app')
)
