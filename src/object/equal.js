/**
 * simple comparison for equality using JSON.stringify()
 * problem: fails on cicular objects
 * @param {any} a
 * @param {any} b
 * @returns {boolean}
 */
export const equalSimple = (a, b) => JSON.stringify(a) === JSON.stringify(b)

/**
 * compare for equality
 * @param {any} a
 * @param {any} b
 * @returns {boolean} true if a equals b
 */
export const equal = (a, b, visited = { a: [], b: [] }) => {
  if (a === b) {
    return true
  }

  if (Object.prototype.toString.call(a) !== Object.prototype.toString.call(b)) {
    return false
  }

  if (a instanceof Date && b instanceof Date) {
    return a.getTime() === b.getTime()
  }

  if (!a || !b || (typeof a !== 'object' && typeof b !== 'object')) {
    return a === b
  }

  if (a.prototype !== b.prototype) return false

  const keys = Object.keys(a)
  if (keys.length !== Object.keys(b).length) return false

  if (~visited.a.indexOf(a) || ~visited.b.indexOf(b)) {
    return ~visited.a.indexOf(a) === ~visited.b.indexOf(b)
  }

  visited.a.push(a)
  visited.b.push(b)
  const result = keys.every((k) => equal(a[k], b[k], visited))
  visited.a.pop()
  visited.b.pop()
  return result
}
