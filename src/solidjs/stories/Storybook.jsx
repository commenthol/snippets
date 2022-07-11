import { For } from 'solid-js/web'
import { createSignal } from 'solid-js'
import styles from './Storybook.module.css'

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => JSX.Element} component
 */

/**
 * Minimal Storybook for solid-js
 * @param {object} param0
 * @param {Story[] | HTMLElement[] | JSX.Element[]} param0.stories stories
 * @param {string} [param0.header='Storybook'] title
 * @param {string} [param0.href='/'] header link
 * @returns {Node}
 */
export default function Storybook ({ stories, header = 'Storybook', href = '/stories/index.html' }) {
  const [Component, setComponent] = createSignal(() => <p>The simple storybook for <a href='https://dev.solidjs.com' target='_blank' rel='norel noreferrer'>solid-js</a></p>)
  const [active, setActive] = createSignal(false)
  const locHash = location.hash.substring(1)

  const setActiveComponent = (component, title) => {
    setActive(title)
    setComponent(component)
  }

  const handleClick = (component, title) => (ev) => {
    setActiveComponent(component, title)
  }

  function Story (props) {
    const { component, index } = props

    let title
    let _component
    if (component.title) {
      title = component.title
      _component = component.component
    } else {
      // show component in sidebar
      return component
    }

    if (!active() && !locHash && index === 0) {
      window.requestAnimationFrame(() => {
        setActiveComponent(_component, title)
      })
    } else if (!active() && title === locHash) {
      window.requestAnimationFrame(() => {
        setActiveComponent(_component, title)
      })
    }

    return (
      <div>
        <a href={`#${title}`}
          tabIndex={0}
          ariaRole='button'
          class={active() === title ? styles.active : ''}
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
        <For each={stories}>
          {(component, index) => <Story component={component} index={index()} />}
        </For>
      </aside>
      <section>
        {Component()}
      </section>
    </main>
  )
}
