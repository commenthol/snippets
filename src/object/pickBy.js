/**
 * pick `object` properties by truthy result of function `fn`
 */
export const pickBy = (object, fn) =>
  Object.keys(object)
    .filter(p => fn(object[p], p))
    .reduce((o, p) => {
      o[p] = object[p]
      return o
    }, {})
