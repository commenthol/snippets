/**
 * Converts `value` to a plain object flattening inherited enumerable string keyed properties of `value` to own properties of the plain object.
 * @param {any} value value to convert
 * @returns {object} converted plain object
 */
export function toPlainObject (value) {
  const obj = Object(value)
  const plain = {}
  for (const key in obj) {
    plain[key] = obj[key]
  }
  return plain
}
