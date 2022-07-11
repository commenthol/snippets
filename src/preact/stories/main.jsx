/* eslint-disable react/jsx-key */
import { render } from 'preact'

import Storybook from './Storybook'

import { storyAriaButton } from '../components/AriaButton.stories'
import { storyHighlight } from '../components/Highlight.stories'
import { storyUseLocalState } from '../hooks/useLocalState.stories'
import { storyWithChildren } from '../utils/withChildren.stories'

render(
  <Storybook stories={[
    <small>Components</small>,
    {
      title: 'Button',
      component: () => <button onClick={() => alert('Hi')}>Click me</button>
    },
    storyAriaButton,
    storyHighlight,
    <small>hooks</small>,
    storyUseLocalState,
    <small>utils</small>,
    storyWithChildren
  ]}/>,
  document.getElementById('app')
)
