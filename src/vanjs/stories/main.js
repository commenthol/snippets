import Storybook from './Storybook'
import van from 'vanjs-core'
const { button, div, small } = van.tags

// -- define or import your stories ---

const storyButton = {
  title: 'Button',
  component: () => button({ onclick: () => alert('Hi') }, 'Click me'),
}

const Counter = () => {
  const counter = van.state(0)
  return div(
    button({ onclick: () => --counter.val }, '-'),
    counter,
    button({ onclick: () => ++counter.val }, '+')
  )
}
const storyCounter = {
  title: Counter.name,
  component: Counter,
}

// --- add them to the storybook ---

van.add(
  document.body,
  Storybook({
    stories: [small('Components'), storyButton, storyCounter],
  })
)
