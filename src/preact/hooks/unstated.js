// SPDX-License-Identifier: MIT
/**
 * unstated-next for preact
 * @credits https://github.com/jamiebuilds/unstated-next
 * @license MIT
 */

import { createContext, createElement } from 'preact'
import { useContext } from 'preact/hooks'

/**
 * @typedef {{
 *  Provider: preact.Provider<any>
 *  Context: preact.Context<any>
 *  useContainer: () => object
 * }} Container
 */

/**
 * create a container which wraps "useHook"
 *
 * @param {(initialState: any) => object} useHook
 * @returns {Container}
 */
export function createContainer (useHook) {
  const Context = createContext(null)

  function Provider (props) {
    const value = useHook(props.initialState)
    return createElement(Context.Provider, { value }, props.children)
  }

  function useContainer () {
    const value = useContext(Context)

    if (value === null) {
      throw new Error('Component must be wrapped with <Container.Provider>')
    }

    return value
  }

  return {
    Provider,
    Context,
    useContainer
  }
}

/**
 * @param {Container} container
 * @returns {object} hook context
 */
export function useContainer (container) {
  return container.useContainer()
}
