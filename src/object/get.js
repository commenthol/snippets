/**
 * get value at `path` from `object`
 * @example
 * get({a: {b: {c: 2}}}, ['a', 'b', 'c']) //> 2
 */
export const get = (object, path = [], def) => {
  let o = object
  if (!Array.isArray(path)) path = path.split(/\./)
  for (const p of path) {
    if (!(o && typeof o === 'object' && p in o)) return def
    o = o[p]
  }
  return o
}
