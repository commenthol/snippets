/**
 * merge objects
 * does not break on circularities
 * @param  {...Object} objs
 * @return {Object}
 */
export const merge = (...objs) =>
  [...objs].reduce((acc, obj) => {
    if (!obj || typeof obj !== 'object') return obj
    Object.keys(obj).forEach((k) => {
      acc[k] =
        Object.prototype.hasOwnProperty.call(acc, k) &&
        typeof acc[k] === 'object'
          ? merge(acc[k], obj[k])
          : obj[k]
    })
    return acc
  }, {})
