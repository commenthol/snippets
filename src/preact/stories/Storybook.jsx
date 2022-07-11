import styles from './Storybook.module.css'
import { h } from 'preact'
import { useState } from 'preact/hooks'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

/**
 * Minimal Storybook for preact
 * @param {object} param0
 * @param {Story[] | HTMLElement[] | JSX.Element[]} param0.stories stories
 * @param {string} [param0.header='Storybook'] titel
 * @param {string} [param0.href='/'] header link
 * @returns {Node}
 */
export default function Storybook ({ stories, header = 'Storybook', href = '/stories/index.html' }) {
  const [Component, setComponent] = useState(<span></span>)
  const [active, setActive] = useState()
  const locHash = location.hash.substring(1)

  const setActiveComponent = (component, title) => {
    setActive(title)
    setComponent(h(component))
  }

  const handleClick = (component, title) => (ev) => {
    setActiveComponent(component, title)
  }

  const Story = ({ component, index }) => {
    let title
    let _component
    if (component.title) {
      title = component.title
      _component = component.component
    } else {
      // titel = component.displayName || component.name
      // _component = component
      return component
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
          ariaRole='button'
          className={className}
          onClick={handleClick(_component, title)}
        >
          {title}
        </a>
      </div>
    )
  }

  return (
    <main className={styles.storybook}>
      <aside className={styles.stories}>
        <h4 onClick={() => { location.href = href }}>{header}</h4>
        {stories.map((component, index) => <Story key={index} component={component} index={index}></Story>)}
      </aside>
      <section>
        {Component}
      </section>
    </main>
  )
}
