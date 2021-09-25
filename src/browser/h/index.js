import { render, h, Fragment, useState, useEffect, useRef } from './h.js'

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

function HyperScriptSample () {
  return h(Fragment, {}, [
    h('h1', { className: 'red' }, [
      'hooked hyperscript'
    ]),
    h('p', {}, '<script>/* escaping works */</script>'),
    h('p', { style: { color: 'blue', textTransform: 'uppercase' } }, 'Lorem ipsum.'),
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

render(document.body, {}, [
  h('style', {}, style),
  HyperScriptSample(),
  UseStateSample(),
  UseRefSample(),
  UseEffectSample()
])
