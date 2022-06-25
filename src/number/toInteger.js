/**
 * Converts `value` to an integer
 * @param {any} value The `value` to convert.
 * @returns {number|undefined} Returns converted integer or undefined if `value` is not a number
 */
export const toInteger = (value) => Number.isSafeInteger(Number(value))
  ? Math.floor(Number(value))
  : undefined
