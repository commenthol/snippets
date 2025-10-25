const PROTO_KEYS = ['__proto__', 'constructor', 'prototype']

/**
 * set `value` at `keys` from `object`
 * @param {object} obj
 * @param {string|string[]} keys
 * @param {any} value
 * @returns {object}
 * @example
 * set({a: {b: {c: 2}}}, ['a', 'b', 'c'], 3)
 * //> {a: {b: {c: 3}}}
 */
export const set = (obj, keys = [], value) => {
  let key = ''
  let ref
  let tmp = obj
  // prevent prototype pollution
  if (PROTO_KEYS.includes(keys[0])) {
    return obj
  }
  for (key of keys) {
    ref = tmp
    const type = Object.prototype.toString.call(tmp[key])
    if (type !== '[object Object]' && type !== '[object Array]') {
      tmp[key] = {}
    }
    tmp = tmp[key]
  }

  if (Array.isArray(ref[key])) {
    ref[key].push(value)
  } else {
    ref[key] = value
  }
  return obj
}
