/**
 * pick `object` properties by truthy result of function `fn`
 * @param {object} obj
 * @param {Function} fn
 * @returns {object}
 */
export const pickBy = (obj, fn) =>
  Object.keys(obj).reduce((o, p) => {
    if (fn(obj[p], p)) {
      o[p] = obj[p]
    }
    return o
  }, {})
