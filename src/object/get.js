/**
 * get value at `keys` from `object`
 * @param {object} obj
 * @param {string|string[]} keys
 * @param {any} def default value being returned in case of not found key
 * @returns {any}
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c'])
 * //> 2
 */
export const get = (obj, keys = [], def) => {
  let tmp = obj
  const _keys = (typeof keys === 'string')
    ? keys.split('.')
    : keys
  for (const key of _keys) {
    if (tmp?.[key] !== undefined) {
      tmp = tmp[key]
    } else {
      return def
    }
  }
  return tmp
}

// even compacter but lacks of early break
// export const _get = (obj, keys = [], def) => keys.reduce((o, key) => (o && o[key] ? o[key] : def), obj)
