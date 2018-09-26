/**
 * get value at `path` from `object`
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c']) //> 2
 */
export const get = (object, path = [], def) => {
  let o = object
  for (let p of path) {
    if (!(p in o)) return def
    o = o[p]
  }
  return o
}
