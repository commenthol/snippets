/**
 * A faster deep clone for objects and arrays only
 * won't clone object properties with enumerable descriptor set to false
 * consider using built-in `structuredClone()`
 * @param {any} obj
 * @returns {any}
 */
export const deepCloneObj = (obj) => {
  if (!obj) {
    return obj
  } else if (Array.isArray(obj)) {
    const clone = []
    for (let i = 0; i < obj.length; i++) {
      clone[i] = deepCloneObj(obj[i])
    }
    return clone
  } else if (typeof obj === 'object') {
    const clone = {}
    for (const key of Object.keys(obj)) {
      clone[key] = deepCloneObj(obj[key])
    }
    return clone
  } else {
    return obj
  }
}
