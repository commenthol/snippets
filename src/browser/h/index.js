import { render, h, Fragment, useState, useEffect, useRef, createContext, useContext } from './h.js'

const style = `
.red { color: red; }
.counter {
  display: inline-block;
  border: 1px solid green; 
  border-radius: 0.3em; 
  padding: 0.8em;
  min-width: 1.5em;
  text-align: center;
}
`

// ---- web component ----
class HookedElement extends HTMLElement {
  constructor () {
    super()
    this._shadowRoot = this.attachShadow({ mode: 'open' })
    const attrs = Object.getPrototypeOf(this).constructor.observedAttributes || []
    attrs.forEach(attr => {
      const _attr = `_${attr}`
      Object.defineProperty(this, attr, {
        get: () => this[_attr],
        set: (v) => {
          const o = this[_attr]
          this[_attr] = v
          if (this._connected_ && o !== v) this._render()
        }
      })
    })
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render()
    }
  }

  connectedCallback () {
    this._connected_ = true
    this._render()
  }

  _render () {
    this._shadowRoot.innerHTML = null
    requestAnimationFrame(() => {
      this.render()
    })
  }
}

class XCustom extends HookedElement {
  static get observedAttributes () {
    return ['options']
  }

  render () {
    render(this._shadowRoot, {}, [
      h('p', { style: { padding: '0.5em', backgroundColor: '#ffffe0' } },
        `<x-custom options='${JSON.stringify(this._options)}' />`
      )
    ])
  }
}
customElements.define('x-custom', XCustom)

// ---- samples ----
function HyperScriptSample () {
  return h(Fragment, {}, [
    h('h1', { className: 'red' }, [
      'hooked hyperscript'
    ]),
    h('p', {}, '<script>/* escaping works */</script>'),
    h('p', { style: { color: 'blue', textTransform: 'uppercase' } }, 'Lorem ipsum.'),
    h('x-custom', { options: { foo: 'bar' } }),
    h('button', { onClick: () => alert('clicked'), style: { marginBottom: '1em' } }, 'Show alert')
  ])
}

/**
 * functional component with state using hooks
 * @note the component needs to be wrapped withHook
 */
function Counter (props) {
  const style = { padding: '1em' }
  const { initialCount, ...other } = props
  const [count, setCount] = useState(initialCount || 0)

  return h('div', {}, [
    h('button', { style, onClick: () => setCount(count - 1) }, '-'),
    h(ShowCount, { ...other, count }),
    h('button', { style, onClick: () => setCount(count + 1) }, '+')
  ])
}

function ShowCount ({ count, ...props }) {
  return h('span', props, count)
}

function UseStateSample () {
  return h(Fragment, {}, [
    h('h3', {}, 'useState hook example'),
    h(Counter, { className: 'counter' }),
    h(Counter, { className: 'counter', initialCount: 5 })
  ])
}

function UseRefSample () {
  return h(Fragment, {}, [
    h('h3', {}, 'useRef hook example'),
    h(() => {
      const ref = useRef()
      return h(Fragment, {}, [
        h('input', { ref }),
        h('button', {
          onClick: () => { ref.current.focus() }
        }, 'Focus on click')
      ])
    })
  ])
}

function UseEffectSample () {
  return h(Fragment, {}, [
    h('h3', {}, 'useEffect hook example'),
    h(() => {
      const [count, setCount] = useState(3)

      useEffect(() => {
        document.getElementById('portal').textContent = `You clicked ${count} times.`
      }, [count])

      return [
        h('button', { onClick: () => setCount(count + 1) }, 'count up'),
        h('button', { onClick: () => setCount(0) }, 'reset')
      ]
    }),
    h('p'),
    h('div', { id: 'portal', style: { border: '1px solid black', padding: '0.5em' } })
  ])
}

function UseContextSample () {
  const ThemeContext = createContext({ style: { color: 'blue', backgroundColor: 'cyan' } })

  const ThemeToggleProvider = ({ children }) => {
    const theme = [
      { color: 'blue', backgroundColor: 'cyan' },
      { color: 'cyan', backgroundColor: 'blue' }
    ]
    const [themeIndex, _setTheme] = useState(0)

    const setTheme = () => {
      const i = (themeIndex + 1) % theme.length
      _setTheme(i)
    }
    const value = { style: theme[themeIndex], setTheme }

    return h(ThemeContext.Provider, { value }, children)
  }

  return h(Fragment, {}, [
    h('h3', {}, 'useContext sample'),
    h(ThemeContext.Provider, { value: { style: { color: 'red', backgroundColor: 'yellow' } } }, [
      h('section', {}, [
        h('div', {}, [
          h(ThemeContext.Consumer, {}, [
            h((props) => {
              return h('p', props, 'foobar')
            })
          ])
        ]),

        h(ThemeToggleProvider, {}, [
          h('div', {}, [
            h('div', { style: { border: '3px solid magenta' } }, [
              h(ThemeContext.Consumer, {}, [
                h(props => {
                  return h('p', props, 'consumed')
                })
              ])
            ]),
            h(() => {
              const { setTheme, ...props } = useContext(ThemeContext)
              return [
                h('p', props, 'colors'),
                h('button', { onClick: setTheme }, 'toggle theme')
              ]
            })
          ])
        ])
      ])
    ])
  ])
}

render(document.body, {}, [
  h('style', {}, style),
  HyperScriptSample(),
  UseStateSample(),
  UseRefSample(),
  UseEffectSample(),
  UseContextSample()
])
