/**
 * merge objects
 * does not break on circularities
 * @param  {...Object} objs
 * @return {Object}
 */
const _merge = (visited, ...objs) =>
  [...objs].reduce((acc, obj) => {
    if (!obj || typeof obj !== 'object') return obj
    if (!~visited.indexOf(obj)) {
      visited.push(obj)
      Object.keys(obj).forEach((k) => {
        acc[k] =
          Object.prototype.hasOwnProperty.call(acc, k) &&
          typeof acc[k] === 'object'
            ? _merge(visited, acc[k], obj[k])
            : obj[k]
      })
      visited.pop()
    }
    return acc
  }, {})

export const mergeCircular = (...objs) => _merge([], ...objs)
