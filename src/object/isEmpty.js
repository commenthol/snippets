/**
 * check if object is empty
 * close to compatible with lodash.isEmpty()
 * @param {any} v
 * @returns {boolean}
 */
export const isEmpty = (v) =>
  v === null ||
  v === undefined ||
  v === '' ||
  (typeof v !== 'object' && typeof v !== 'string')
    ? true
    : (v instanceof Map || v instanceof Set)
        ? v.size === 0
        : (typeof v === 'object' && !Object.keys(v).length)

/**
 * Check if prototype function is empty
 * @param {object|any} proto
 * @returns {boolean}
 */
export const isEmptyPrototype = (proto) => {
  const { constructor, ...other } = proto
  return isEmpty(other)
}
