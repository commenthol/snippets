/**
 * pick `object` properties by truthy result of function `fn`
 * @param {object} obj
 * @param {Function}} fn
 * @returns {object}
 */
export const pickBy = (obj, fn) =>
  Object.keys(obj)
    .filter(p => fn(obj[p], p))
    .reduce((o, p) => {
      o[p] = obj[p]
      return o
    }, {})
