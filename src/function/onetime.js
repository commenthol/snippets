/**
 * ensures that `fn` is only called once
 * @template T
 * @param {() => T} fn
 * @returns {() => T}
 */
export function onetime(fn) {
  let result
  let isCalled = false

  if (typeof fn !== 'function') {
    throw new Error('fn needs to be a function')
  }

  return () => {
    if (isCalled) {
      return result
    }
    isCalled = true
    result = fn()
    return result
  }
}
