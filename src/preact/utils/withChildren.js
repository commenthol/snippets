import { cloneElement, isValidElement } from 'preact'

/**
 * HoC for passing children props to either a function or component
 * @param {Node|Node[]|null} children
 * @param {object} [props] take care to not add `ref` as prop
 * @returns {Node}
 */
export function withChildren(children, props) {
  if (!children) {
    return null
  }
  if (Array.isArray(children)) {
    return children.map((child) => withChildren(child, props || {}))
  }
  if (typeof children === 'function') {
    return children(props)
  }
  // if it's a string or HTML element then don't apply the props
  if (!isValidElement(children) || typeof children.type === 'string') {
    return children
  }
  return cloneElement(children, { ...children.props, ...props })
}
