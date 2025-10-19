// SPDX-License-Identifier: MIT
/**
 * @see https://dev.to/ryansolid/building-a-reactive-library-from-scratch-1i0p
 * @license (c) 2022 Ryan Carniato
 * License is assumed to be MIT or similar as with solid-js
 */

/**
 * @typedef {{
 *  execute: () => void
 *  dependencies: Set<Dependency>
 * }} Subscriber
 */
/**
 * @typedef {Set<Subscriber>} Dependency
 */

// global context for nested reactivity
const context = []

/**
 * @param {any} value
 * @returns {[signal: () => any, set: (nextValue: any) => void]}
 */
export function createSignal(value) {
  /** @type {Set<Subscriber>} */
  const subscriptions = new Set()

  const signal = () => {
    const running = context[context.length - 1]
    if (running) {
      subscriptions.add(running)
      running.dependencies.add(subscriptions)
      // console.debug(value, subscriptions.size)
    }
    return value
  }

  const set = (nextValue) => {
    value = nextValue

    for (const running of [...subscriptions]) {
      // emit events
      running.execute()
    }
  }
  return [signal, set]
}

/**
 * @param {Subscriber} running
 */
function cleanup(running) {
  for (const dep of running.dependencies) {
    dep.delete(running)
  }
  running.dependencies.clear()
}

/**
 * @param {() => void} fn
 */
export function createEffect(fn) {
  const execute = () => {
    cleanup(running)
    context.push(running)
    try {
      fn()
    } finally {
      context.pop()
    }
  }

  const running = {
    execute,
    dependencies: new Set(),
  }

  execute()
}

/**
 * @param {()=> void} fn
 * @returns {() => void} signal
 */
export function createMemo(fn) {
  const [signal, set] = createSignal()
  createEffect(() => set(fn()))
  return signal
}
