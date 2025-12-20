/**
 * @param {string} value
 * @returns {boolean is string}
 */
export const isDateISOString = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value) &&
  !isNaN(Date.parse(value))

/**
 * @param {string} value
 * @returns {boolean is string}
 */
export const isBigIntString = (value) =>
  typeof value === 'string' && /^\d+n$/.test(value)

/**
 * @param {string} _key
 * @param {any} value
 * @returns {any}
 */
function bigIntReplacer(_key, value) {
  if (typeof value === 'bigint') {
    return value.toString() + 'n'
  }
  return value
}

/**
 * @param {string} _key
 * @param {any} value
 * @returns {any}
 */
function bigIntDateReviver(_key, value) {
  if (isBigIntString(value)) {
    return BigInt(value.slice(0, -1))
  }
  if (isDateISOString(value)) {
    return new Date(value)
  }

  return value
}

/**
 * Stringify BigInt to JSON
 */
export const jsonBigIntStringify = (value) =>
  JSON.stringify(value, bigIntReplacer)

/**
 * Parse BigInt and DateISOString from JSON
 */
export const jsonBigIntDateParse = (value) =>
  JSON.parse(value, bigIntDateReviver)
