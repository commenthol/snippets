/**
 * change function name
 * @param {function} fn
 * @param {string} name
 */
export function changeFunctionName (fn, name) {
  Object.defineProperty(fn, 'name', { writable: true })
  fn.name = name
}
