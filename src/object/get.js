/**
 * get value at `keys` from `object`
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c']) //> 2
 */
export const get = (obj, keys = [], def) => {
  let o = obj
  if (typeof keys === 'string') keys = keys.split('.')
  for (const key of keys) {
    if (o && o[key]) { o = o[key] } else { return def }
  }
  return o
}

// even compacter but lacks of early break
// export const _get = (obj, keys = [], def) => keys.reduce((o, key) => (o && o[key] ? o[key] : def), obj)
