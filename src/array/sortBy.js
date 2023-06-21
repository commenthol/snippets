/**
 * sort strings, numbers, booleans
 * @private
 * @param {any} a
 * @param {any} b
 * @returns {number}
 */
const sort = (a, b) => typeof a === 'string'
  ? a.localeCompare(b)
  : a - b

/**
 * @param {object[]} arrOfObjs
 * @param {string|string[]} keys
 * @returns {object[]} sorted array of objects
 */
export const sortBy = (arrOfObjs, keys) => {
  const _keys = typeof keys === 'string' ? [keys] : keys
  const sorter = (a, b) => {
    for (const key of _keys) {
      const r = sort(a[key], b[key])
      if (r !== 0) return r
    }
    return 0
  }
  return arrOfObjs.sort(sorter)
}
