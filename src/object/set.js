/**
 * set `value` at `path` from `object`
 * @example
 * set({a: {b: {c: 2}}}, ['a', 'b', 'c'], 3)
 */
export const set = (object, path = [], value) => {
  let p
  let ref
  let o = object
  for (p of path) {
    ref = o
    if (toString.call(o[p]) !== '[object Object]') o[p] = {}
    o = o[p]
  }
  ref[p] = value
  return object
}
