/**
 * merge objects
 * does not break on circularities
 * @param  {...Object} objs
 * @return {Object}
 */
export const merge = (...objs) =>
  [...objs].reduce(
    (acc, obj) => Object.keys(obj).reduce((_a, k) => {
      if (k !== '__proto__') { // avoid prototype pollution
        acc[k] = Object.prototype.hasOwnProperty.call(acc, k) && typeof acc[k] === 'object'
          ? merge(acc[k], obj[k])
          : obj[k]
      }
      return acc
    }, {}),
    {}
  )