const CHILDREN = 'children'

/**
 * hyperscript...
 * no components; facilitates rendering into DOM
 * @param {string|Node} e - element
 * @param {object} p - props
 * @param {string|string[]|Node|Node[]} c - children
 * @returns {Node}
 */
export function render (e, p = {}, c) {
  // support for `hooked` functional components
  if (typeof e === 'function') {
    return withHook(e, { ...p, [CHILDREN]: c })
  }

  const $ = typeof e === 'string' ? document.createElement(e) : e

  Object.entries(p || {}).forEach(([k, v]) => {
    if (k.indexOf('on') === 0) {
      $.addEventListener(k.substring(2).toLowerCase(), v)
    } else if (k === 'style') {
      Object.entries(v).forEach(([p, v]) => { $[k][p] = v })
    } else if (k === 'ref') {
      v && v($) // pass DOM reference
    } else if (k.indexOf('data-') === 0) {
      $.dataset[k.substring(5)] = v
    } else if (k === CHILDREN) {
      // do nothing
    } else {
      $[k] = v
    }
  })

  $.append(...[].concat(c).filter(c => c != null).map(mapChild).flat())
  return $
}

/**
 * wrap hyperscript render to allow later re-render
 * @param {string|Node} e - element
 * @param {object} p - props
 * @param {string|string[]|Node|Node[]} c - children
 * @returns {function}
 */
export const h = (e, p, c) => (np) => render(e, np || p || {}, c)

/**
 * Fragment component
 * @param {object} props
 * @param {string|string[]|Node|Node[]} props.children
 * @returns
 */
export function Fragment (props) {
  return props[CHILDREN]
}

/**
 * @private
 */
function mapChild (c) {
  return (typeof c === 'function')
    ? c()
    : c
}

/// ---- hooks ----

let hooks
let index = 0
let updateF
let current

/**
 * guard and restore the current global state on each render
 * @private
 */
const guard = (fn) => {
  const state = [hooks, updateF, current]
  // execute recursive fn
  fn()
  // restore
  hooks = state[0]
  updateF = state[1]
  current = state[2]
}

const hasChanged = (a, b) => !a || b.some((arg, i) => arg !== a[i])

const getHook = value => {
  let hook = hooks[index++]
  if (!hook) {
    hook = { value }
    hooks.push(hook)
  }
  return hook
}

/**
 * @see https://reactjs.org/docs/hooks-reference.html#usereducer
 */
export const useReducer = (reducer, initialState) => {
  const hook = getHook(initialState)
  const update = updateF
  const setState = state => {
    hook.value = reducer(hook.value, state)
    update()
  }
  return [hook.value, setState]
}

/**
 * @see https://reactjs.org/docs/hooks-reference.html#usestate
 */
export const useState = (initialState) => useReducer(
  (_, v) => v,
  initialState
)

/**
 * @see https://reactjs.org/docs/hooks-reference.html#useeffect
 * @note no cleanup supported; A returned function from useEffect won't be called
 */
export const useEffect = (cb, args = []) => {
  const hook = getHook()
  if (hasChanged(hook.value, args)) {
    hook.value = args
    hook.cb = cb
  }
}

/**
 * @see https://reactjs.org/docs/hooks-reference.html#useref
 */
export const useRef = () => {
  function f (ref) {
    f.current = ref
  }
  f.current = null
  return f
}

/**
 * @see https://reactjs.org/docs/hooks-reference.html#usecontext
 */
export const createContext = (context) => {
  const _context = {
    Provider,
    Consumer
  }

  function Provider ({ value, tag = 'div', ...p }) {
    // mount provider
    const $ = render(tag, { 'data-type': 'provider' }, p[CHILDREN])
    $._context = _context
    $._value = { ...context, ...value }
    return $
  }

  function Consumer (p) {
    const props = useContext(_context)
    return p[CHILDREN][0](props)
  }

  return _context
}

export const useContext = (context) => {
  const $ = current

  if ($._value) {
    const v = $._value
    $._value = null
    return v
  }

  const update = updateF

  useEffect(() => {
    let n = $
    while ((n = n.parentNode)) {
      if (n._context === context) {
        $._value = n._value
        // HINT start re-render of $
        update()
        return
      }
    }
  })

  return {}
}

let id = 0
/**
 * HoC to wrap functional components with hooks
 * @param {function} fn functional component with hooks
 * @param {object} [props] properties
 * @returns {Node}
 */
const withHook = (fn, props) => {
  let childs
  const $ = document.createComment('' + id++)

  // for functional components flatten nested children arrays
  props[CHILDREN] = [props[CHILDREN]].flat()

  function render () {
    // setup
    index = 0
    hooks = $._hs || []
    updateF = render
    current = $
    // remove childs
    $._cs && $._cs.forEach(c => c.remove())
    // render
    childs = $._cs = [].concat(fn(props)).filter(c => c != null).map(mapChild).flat()
    $.after(...$._cs)
    // update
    $._hs = hooks
    // postrender (only after things got mounted in DOM)
    let cycle = 0
    const postRender = () => {
      if (!$.isConnected || !$.parentNode) {
        return cycle++ < 5
          ? window.requestAnimationFrame(postRender)
          : console.error('cycle detected in', $)
      }
      // call useEffect callbacks
      $._hs.forEach(h => {
        const cb = h.cb
        h.cb = null // prevent looping through useContext
        cb && cb()
      })
    }
    postRender()
  }

  // initial render
  guard(render)

  return [$, ...childs]
}
