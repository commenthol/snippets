/**
 * check if the given value is an object
 * @param {any} any
 * @returns {boolean is object}
 */
export const isObject = (any) =>
  typeof any === 'object' && any !== null && Array.isArray(any) === false
