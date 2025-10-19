import styles from './Storybook.module.css'
import van from 'vanjs-core'
const { a, aside, div, h4, main, p, section } = van.tags

const classnames = (...args) => args.filter(Boolean).join(' ')

/**
 * @typedef {object} Story
 * @property {string} title
 * @property {() => HTMLElement} component
 */

/**
 * Simple Storybook for vanjs
 * @param {object} props
 * @param {Story[] | HTMLElement[] | Function[]} props.stories stories
 * @param {string} [props.header='Storybook'] title
 * @param {string} [props.href='/'] header link
 * @returns {HTMLElement}
 */
export default function Storybook(props) {
  const { stories, header = 'Storybook', href = '/stories/index.html' } = props

  const Component = van.state(() =>
    p(
      'The simple storybook for ',
      a(
        {
          href: 'https://github.com/vanjs-org/van',
          target: '_blanc',
          rel: 'norel noreferrer',
        },
        'vanjs'
      )
    )
  )

  // state change causes full rerendering...
  const active = van.state('')
  const locHash = decodeURIComponent(location.hash.substring(1))

  const setActiveComponent = (component, title) => {
    active.val = title
    Component.val = component
  }

  const handleClick = (component, title) => (_ev) => {
    setActiveComponent(component, title)
  }

  return main(
    { className: classnames(styles.storybook) },
    van.derive(() =>
      aside(
        { className: classnames(styles.stories) },
        h4(
          {
            onclick: () => {
              location.href = href
            },
          },
          header
        ),
        stories.map((component, index) =>
          Story({
            component,
            index,
            locHash,
            handleClick,
            active,
            setActiveComponent,
          })
        )
      )
    ),
    van.derive(() => section({ className: 'stories' }, Component.val))
  )
}

function Story(props) {
  const { component, index, handleClick, active, setActiveComponent, locHash } =
    props

  let title
  let _component

  if (component instanceof HTMLElement) {
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

  return div(
    a(
      {
        href: `#${title}`,
        tabIndex: 0,
        'aria-role': 'button',
        className,
        onclick: handleClick(_component, title),
      },
      title
    )
  )
}
