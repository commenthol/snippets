import { useState } from 'preact/hooks'
import { AriaButton } from './AriaButton'
import { stopPropagation } from '../utils/stopPropagation'

export const storyAriaButton = {
  title: 'AriaButton',
  component: () => {
    const style = `
      .aria-button [role=button] {
        background-color: #fdc;
      }
      .aria-button [role=button][aria-pressed=true] {
        background-color: #cfc;
      }
      kbd {
        background-color: #eee;
        border-radius: 3px;
        border: 1px solid #b4b4b4;
        box-shadow: 0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset;
        color: #333;
        display: inline-block;
        font-size: .85em;
        font-weight: 700;
        line-height: 1;
        padding: 2px 4px;
        white-space: nowrap;
      }
    `

    const [count, setCount] = useState(0)
    const handleClick = (ev) => {
      stopPropagation(ev, true)
      setCount(count + 1)
    }

    return (
      <div className='aria-button'>
        <style>{style}</style>
        <h2># Clicks = {count}</h2>

        <p>Button - while active press <kbd>space</kbd> or <kbd>Enter</kbd></p>
        <AriaButton>
          <button onClick={handleClick}>Click Me</button>
        </AriaButton>

        <p></p>
        <AriaButton>
          <a href='#' onClick={handleClick}>Link</a>
        </AriaButton>

        <p></p>
        <AriaButton ariaPressed={true}>
          <button onClick={handleClick}>Toggle Button</button>
        </AriaButton>
      </div>
    )
  }
}
