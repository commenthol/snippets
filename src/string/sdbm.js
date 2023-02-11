/**
 * @see http://www.cse.yorku.ca/~oz/hash.html
 * @param {string} string
 * @returns {number}
 */
export function sdbm (string) {
  let hashNum = 0
  const len = string.length
  let i = -1
  while (++i < len) {
    hashNum = string.charCodeAt(i) + (hashNum << 16) + (hashNum << 6) - hashNum
  }
  return hashNum >>> 0
}
