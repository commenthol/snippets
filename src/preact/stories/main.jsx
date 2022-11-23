/* eslint-disable react/jsx-key */
import { render } from 'preact'

import Storybook from './Storybook'

import { storyAriaButton } from '../components/AriaButton.stories'
import { storyHighlight } from '../components/Highlight.stories'
import { storyUseLocalState } from '../hooks/useLocalState.stories'
import { storyUseUniState } from '../hooks/useUniState.stories'
import { storyUseFetch } from '../hooks/useFetch.stories'
import { storyUseFormik } from '../hooks/useFormik.stories'
import { storyUnstated } from '../hooks/unstated.stories'
import { storyUseTranslation} from '../hooks/useTranslation.stories'
import { storyWithChildren } from '../utils/withChildren.stories'

render(
  <Storybook stories={[
    <small>Components</small>,
    {
      title: 'Button',
      component: () => <button onClick={() => alert('Hi')}>Click me</button>
    },
    {
      title: 'Error',
      component: () => (
        <div>
          <Unknown />
        </div>
      )
    },
    storyAriaButton,
    storyHighlight,
    <small>hooks</small>,
    storyUseLocalState,
    storyUseUniState,
    storyUseFetch,
    storyUnstated,
    storyUseFormik,
    storyUseTranslation,
    <small>utils</small>,
    storyWithChildren
  ]}/>,
  document.getElementById('app')
)
