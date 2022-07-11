import { render } from 'solid-js/web'

import Storybook from './Storybook.jsx'

import { storyUseLocalState } from '../hooks/useLocalState.stories.jsx'

import { storyCounter } from '../examples/Counter.stories.jsx'
import { storyList } from '../examples/List.stories.jsx'
import { storyResetCounterProvider } from '../examples/ResetCounterProvider.stories.jsx'
import { storyShowToggle } from '../examples/ShowToggle.stories.jsx'
import { storyClockHoc } from '../examples/ClockHoc.stories.jsx'
import { storyClockHook } from '../examples/ClockHook.stories.jsx'
import { storyClockProps } from '../examples/ClockProps.stories.jsx'

render(
  () => <Storybook stories={[
    <small>Components</small>,
    {
      title: 'Button',
      component: () => <button onClick={() => alert('Hi')}>Click me</button>
    },
    {
      title: 'Test',
      component: () => <h1>It works!</h1>
    },
    <small>Hooks</small>,
    storyUseLocalState,
    <small>Examples</small>,
    storyCounter,
    storyList,
    storyResetCounterProvider,
    storyShowToggle,
    storyClockHoc,
    storyClockHook,
    storyClockProps
  ]}/>,
  document.getElementById('app')
)
