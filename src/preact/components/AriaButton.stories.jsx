import { useState } from 'preact/hooks'
import { AriaButton } from './AriaButton'
import { stopPropagation } from '../utils/stopPropagation'

export const storyAriaButton = {
  titel: 'AriaButton',
  component: () => {
    const style =`
      .aria-button [role=button] { 
        background-color: #fdc; 
      }
      .aria-button [role=button][aria-pressed=true] { 
        background-color: #cfc; 
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