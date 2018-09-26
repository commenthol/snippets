/**
 * convert array of objects to map with prop as keys
 * @param {array<object>} arr
 * @param {string} prop
 * @return {object}
 */
export const mapByProp = (arr, prop) => arr.reduce((obj, item) => {
  const key = item[prop]
  if (key) obj[key] = item
  return obj
}, {})
