# hooked hyperscript 

This is a very simple hyperscript helper to render elements directly in the DOM.

Hooks are supported as well.

Size is less then 1kB minimized and gzipped.

## h, render

Function `h` is used to render elements into the DOM.

    h(element, props, children)

`element` can be of type HTML-Node, string or functions (functional components) are accepted.

```js
render(document.body, {}, [
  h('span', { className: 'lorem' }, 'Lorem')
  h('span', {}, 'ipsum')
])
```

renders as 

```html
<body>
  <span class="lorem">Lorem</span>
  <span>ipsum</span>
</body>
```

Functional components have `children` passed as props (as with react).

e.g. to render children nodes within a `<section>`:  
```js
// functional component
function Comp ({ children, ...props }) {
  return h('section', props, children)
}

// rendering
render(document.body, {}, [
  h(Comp, { className: 'red' }, [
    h('span', { className: 'lorem' }, 'Lorem')
    h('span', {}, 'ipsum')
  ])
])
```

renders as 

```html
<body>
  <section class="red">
    <span class="lorem">Lorem</span>
    <span>ipsum</span>
  </section>
</body>
```

## usage

```js
import { h, render } from './h.js'

const style = `
body > .red { color: red; } 
`

render(document.body, {}, [
  h('style', {}, style),
  h('h1', { className: 'red' }, [
    'hooked hyperscript'
  ]),
  h('p', {}, '<script>/* escaping works */</script>'),
  h('p', { style: { 
    color: 'blue', 
    textTransform: 'uppercase' 
  } }, 'Lorem ipsum.'),
  h('button', { 
    onClick: () => alert('clicked'), 
    style: { marginBottom: '1em' } 
  }, 'Click me'),
])
```

## usage with hooks

```js
import { render, h, Fragment, useState } from './h.js'

function Counter (props) {
  const style = { padding: '1em' }
  const [count, setCount] = useState(0)

  return h(Fragment, {}, [
    h('button', { style, onClick: () => setCount(count - 1)}, '-'),
    h('span', props, count),
    h('button', { style, onClick: () => setCount(count + 1)}, '+'),
  ])
}

render(document.body, {}, 
  h(Counter, { style: { color: 'cyan' } })
)
```
