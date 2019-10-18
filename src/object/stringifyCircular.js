/**
 * stringify circular objects by removing the circularity
 */
export const stringifyCircular = (obj, replacer, space) => {
  const visited = []
  const _replacer = (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (~visited.indexOf(value)) {
        try {
          return JSON.parse(JSON.stringify(value))
        } catch (e) {
          return
        }
      }
      visited.push(value)
    }
    return replacer ? replacer(key, value) : value
  }
  return JSON.stringify(obj, _replacer, space)
}
