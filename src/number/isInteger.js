/**
 * Checks if `value` is an integer
 * @param {any} value The `value` to check
 * @returns {boolean} Returns `true` if `value` is an integer, otherwise `false`
 */
export const isInteger = (value) => Number.isSafeInteger(Number(value))
