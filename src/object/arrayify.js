/**
 * converts object values into an array
 * @param {object} obj
 * @param {string[]} [keys] include only dedicated keys
 * @returns {object}
 */
export function arrayify(obj, keys) {
  for (const [key, value] of Object.entries(obj)) {
    if (value && !Array.isArray(value) && (!keys || keys.includes(key))) {
      obj[key] = [value]
    }
  }
  return obj
}
