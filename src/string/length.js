/**
 * Return the number of symbols a string contains
 * length('A') == 1
 * length('💩') == 1 (where '💩'.length == 2)
 * @see https://mathiasbynens.be/notes/javascript-unicode
 * @param {string} str
 * @returns {number} length of symbols
 */
export function length (str) {
  return [...str].length
}
