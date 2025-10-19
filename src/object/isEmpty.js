/**
 * check if `value` is empty
 * close to compatible with lodash.isEmpty()
 * @param {any} value
 * @returns {boolean}
 */
export const isEmpty = (value) =>
  value === null ||
  value === undefined ||
  value === '' ||
  (typeof value !== 'object' && typeof value !== 'string')
    ? true
    : value instanceof Map || value instanceof Set
      ? value.size === 0
      : typeof value === 'object' && !Object.keys(value).length

/**
 * check if `value` is an empty object or array
 * @param {any} value
 * @returns {boolean}
 */
export const isEmptyObj = (value) =>
  value === null ||
  value === undefined ||
  (typeof value === 'object' && !Object.keys(value).length)

/**
 * Check if prototype function is empty
 * @param {object|any} proto
 * @returns {boolean}
 */
export const isEmptyPrototype = (proto) => {
  // eslint-disable-next-line no-unused-vars
  const { constructor, ...other } = proto
  return isEmpty(other)
}
