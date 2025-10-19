/**
 * @private
 * @param {object} data
 * @param {string[]} sortByKeys
 * @returns {Function} sorting function
 */
const getSorter = (data, sortByKeys) => {
  const order = [...sortByKeys]
  // sort all keys alphabetically
  Object.keys(data)
    .sort()
    .forEach((key) => {
      if (!order.includes(key)) order.push(key)
    })
  const sortIndex = order.reduce((obj, key, i) => ({ ...obj, [key]: i }), {})
  const sorter = (a, b) => sortIndex[a] - sortIndex[b]
  return sorter
}

/**
 * sorts keys of object in custom order
 * NOTE: This woin't work with number-like keys as they are always put first.
 * This kind of sorting may only be relevant for sorting of objects for better
 * comparison in code-version-systems.
 * @param {object} obj
 * @param {string[]} [sortByKeys]
 * @param {object} [param2]
 * @param {number} [param2.depth=0] max. recursion depth
 * @returns {object}
 */
export function customSort(obj, sortByKeys = [], { depth = 0 } = {}) {
  const out = {}
  Object.keys(obj)
    .sort(getSorter(obj, sortByKeys))
    .forEach((key) => {
      let value = obj[key]
      if (Array.isArray(value)) {
        if (typeof value[0] === 'string') {
          value = value.sort()
        } else if (depth > 0) {
          value = value.map((item) =>
            customSort(item, sortByKeys, { depth: depth - 1 })
          )
        }
      } else if (depth > 0 && value && typeof value === 'object') {
        value = customSort(value, sortByKeys, { depth: depth - 1 })
      }
      out[key] = value
    })
  return out
}
