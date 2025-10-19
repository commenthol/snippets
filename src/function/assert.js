/**
 * @throws
 * @param {any} val
 * @param {string} [msg]
 */
export function assert(val, msg) {
  if (!val) {
    throw new Error(msg || 'Assertion failed')
  }
}

/**
 * @throws
 * @param {any} l
 * @param {any} r
 * @param {string} [msg]
 */
assert.equal = function assertEqual(l, r, msg) {
  if (l !== r) {
    throw new Error(msg || 'Assertion failed: ' + l + ' !== ' + r)
  }
}
