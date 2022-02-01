import styles from './Storybook.module.css'
import { h } from 'preact'
import { useState } from 'preact/hooks'

export default function Storybook ({ stories, header = 'Storybook', href = '/' }) {
  const [Component, setComponent] = useState(<span></span>)
  const [active, setActive] = useState()
  const locHash = location.hash.substring(1)

  const setActiveComponent = (component, titel) => {
    setActive(titel)
    setComponent(h(component))
  }

  const handleClick = (component, titel) => (ev) => {
    setActiveComponent(component, titel)
  }

  const Story = ({ component, index }) => {
    let titel
    let _component
    if (component.titel) {
      titel = component.titel
      _component = component.component
    } else {
      // titel = component.displayName || component.name
      // _component = component
      return component
    }

    if (!active && !locHash && index === 0) {
      window.requestAnimationFrame(() => {
        setActiveComponent(_component, titel)
      })
    } else if (!active && titel === locHash) {
      window.requestAnimationFrame(() => {
        setActiveComponent(_component, titel)
      })
    }

    const className = titel === active ? styles.active : ''

    return (
      <div>
        <a href={`#${titel}`}
          tabIndex={0}
          ariaRole='button'
          className={className}
          onClick={handleClick(_component, titel)}
        >
          {titel}
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
