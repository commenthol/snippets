/* eslint-disable react/no-unknown-property */
import styles from './Storybook.module.css'
import { h, isValidElement } from 'preact'
import { useState, useErrorBoundary } from 'preact/hooks'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

/**
 * Simple Storybook for preact
 * @param {object} props
 * @param {Story[] | HTMLElement[] | JSX.Element[]} props.stories stories
 * @param {string} [props.header='Storybook'] titel
 * @param {string} [props.href='/'] header link
 * @returns {preact.VNode}
 */
export default function Storybook (props) {
  const { stories, header = 'Storybook', href = '/stories/index.html' } = props
  const [error, resetError] = useErrorBoundary()
  const [Component, setComponent] = useState(<p>The simple storybook for <a href='https://preactjs.com/tutorial/' target='_blanc' rel='norel noreferrer'>preact</a></p>)
  const [active, setActive] = useState()
  const locHash = decodeURIComponent(location.hash.substring(1))

  const setActiveComponent = (component, title) => {
    setActive(title)
    setComponent(h(component, {}))
  }

  const handleClick = (component, title) => (ev) => {
    resetError()
    setActiveComponent(component, title)
  }

  if (error) {
    console.error(error)
  }

  return (
    <main className={styles.storybook}>
      <aside className={styles.stories}>
        <h4 onClick={() => { location.href = href }}>{header}</h4>
        {stories.map((component, index) =>
          <Story key={index}
            component={component}
            index={index}
            locHash={locHash}
            handleClick={handleClick}
            active={active}
            setActiveComponent={setActiveComponent}
          />
        )}
      </aside>
      <section className='stories'>
        {error
          ? <div className={styles.error}>
            <h2>Error</h2>
            <p>{error.message}</p>
            <button onClick={resetError}>Try again</button>
            <p> </p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{error.stack}</pre>
          </div>
          : Component
        }
      </section>
    </main>
  )
}

function Story (props) {
  const { component, index, handleClick, active, setActiveComponent, locHash } = props

  let title
  let _component

  if (isValidElement(component)) {
    return component
  } else if (component.title) {
    title = component.title
    _component = component.component
  } else {
    return null
  }

  if (!active && !locHash && index === 0) {
    window.requestAnimationFrame(() => {
      setActiveComponent(_component, title)
    })
  } else if (!active && title === locHash) {
    window.requestAnimationFrame(() => {
      setActiveComponent(_component, title)
    })
  }

  const className = title === active ? styles.active : ''

  return (
    <div>
      <a href={`#${title}`}
        tabIndex={0}
        aria-role='button'
        className={className}
        onClick={handleClick(_component, title)}
      >
        {title}
      </a>
    </div>
  )
}
