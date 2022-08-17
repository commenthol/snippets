import { useReducer } from 'preact/hooks'

const store = {}

const reducer = (key, initial) => {
  store[key] = store[key] ?? initial

  const setState = (current, next) => {
    store[key] = next
    return next
  }

  return [setState, store[key]]
}

/**
 * maintains state across re-renders using a global store
 * @param {string} key
 * @param {any} initial
 * @returns {[state: any, setState: (next: any) => void]}
 * @example
 * const [count, setCount] = useUniState('count', 0)
 */
export const useUniState = (key, initial) => useReducer(...reducer(key, initial))

/**
 * apply custom actions on useUniState
 * @param {string} key
 * @param {any} initial
 * @param {object} actions
 * @returns {[key: string]: any, [action: string]: () => void}
 * @example
 * const actions = (state, setState) => ({
 *  increment: () => { setState(state + 1) }
 * })
 * const { count, increment } = useUniActions('count', 0, actions)
 */
export const useUniActions = (key, initial, actions) => {
  const [state, setState] = useUniState(key, initial)
  return { [key]: state, ...actions(state, setState) }
}
