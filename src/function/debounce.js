/**
 * debounce function `fn` regardless of its arguments
 * @param {Function} fn
 * @param {number} wait
 * @returns {(any[]) => void}
 */
export function debounce (fn, wait = 250) {
  let timerId
  return (...args) => {
    clearTimeout(timerId)
    timerId = setTimeout(() => {
      fn(...args)
    }, wait)
  }
}
