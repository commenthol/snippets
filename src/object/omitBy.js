/**
 * omit `object` properties by truthy result of function `fn`
 * @param {object} obj The source object
 * @param {(value: any, prop: string) => boolean} fn The function invoked per property
 * @returns {object}
 */
export const omitBy = (obj, fn) =>
  Object.keys(obj).reduce((o, p) => {
    if (!fn(obj[p], p)) {
      o[p] = obj[p]
    }
    return o
  }, Object.create(null))
