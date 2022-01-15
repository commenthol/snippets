/**
 * check if string contains lower case characters
 * @param {string} str
 * @returns {boolean}
 */
export function hasLowerCaseChars (str = '') {
  return str !== str.toUpperCase()
}
