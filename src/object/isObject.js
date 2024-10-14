/**
 * check if the given value is an object
 * @param {any} any
 * @returns {boolean}
 */
export const isObject = (any) =>
  typeof any === 'object' && any !== null && Array.isArray(any) === false
