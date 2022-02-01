import { cloneElement } from 'preact'
import { useState } from 'preact/hooks'
import { stopPropagation } from '../utils/index.js'

/**
 * Convert an element into an aria button
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/button_role
 * @param {object} props 
 * @param {VNode} props.children 
 * @param {boolean} [props.ariaPressed] if true or false convert to toggle button
 * @returns {VNode}
 * @example
 * const MyButton = (props) =>
 *   <AriaButton><div onClick={props.handleClick}</div></AriaButton>
 */
export function AriaButton (props) {
  const { children, ariaPressed } = props
  const { onClick } = children.props
  const isToggleButton = ariaPressed !== undefined
  const [isActive, setActive] = useState(!!ariaPressed)

  const handleClick = (ev) => {
    isToggleButton && setActive(!isActive)
    onClick && onClick(ev)
  }

  const handleKey = (ev) => {
    if (ev.key === ' ' || ev.key === 'Enter') {
      stopPropagation(ev, true)
      handleClick(ev)
    }
  }

  const ariaProps = {
    tabindex: 0,  
    role: 'button',
    ariaPressed: isToggleButton ? isActive : undefined,
    onKeydown: handleKey,
    onClick: handleClick
  }

  return cloneElement(children, { ...children.props, ...ariaProps })
}
