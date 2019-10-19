/**
 * set `value` at `keys` from `object`
 * @example
 * set({a: {b: {c: 2}}}, ['a', 'b', 'c'], 3)
 */
export const set = (obj, keys = [], value) => {
  let key
  let ref
  let o = obj
  for (key of keys) {
    ref = o
    if (toString.call(o[key]) !== '[object Object]') o[key] = {}
    o = o[key]
  }
  ref[key] = value
  return obj
}
