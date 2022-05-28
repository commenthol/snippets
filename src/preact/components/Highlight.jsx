import { isValidElement, Fragment } from 'preact'
import styles from './Highlight.module.css'

/**
 * Highlight text
 * @param {object} props
 * @param {VNode} props.children
 * @param {string} [props.mark]
 * @returns {VNode}
 * @example
 * const MyText = (props) =>
 *   <Highlight mark='te'>Lorem ipsum <span>test</span> text</Highlight>
 */
export function Highlight (props) {
  const { children, mark } = props
  return highlightChildren(children, mark)
}

function highlightChildren (children, mark) {
  if (!mark) {
    return children
  }
  if (!children) {
    return null
  }
  if (Array.isArray(children)) {
    return children.map(child => highlightChildren(child, mark))
  }
  if (typeof children === 'string') {
    const parts = children.split(mark)
    if (parts.length <= 1) {
      return children
    }
    return <>
      {parts.shift()}
      {parts.map((part, i) => (
        <Fragment key={i}>
          <span className={styles.highlight}>{mark}</span>
          {part}
        </Fragment>
      ))}
    </>
  }
  if (!isValidElement(children) || typeof children.type === 'string') {
    if (children?.props?.children) {
      children.props.children = highlightChildren(children.props.children, mark)
    }
  }
  return children
}
