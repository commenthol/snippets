import { useMemo } from 'preact/hooks'

export function debounce(fn, waitMs = 250) {
  let timerId
  return (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}

/**
 * debounce a function
 * @param {Function} fn function which requires debounce
 * @param {number} [waitMs=250] wait for ms until function is triggered
 * @param {any[]} [inputs] inputs to watch for changes (you usually don't need to set anything here)
 * @returns {Function} debounced function
 */
export function useDebounce (fn, waitMs, inputs) {
  return useMemo(debounce(fn, waitMs), inputs)
}
