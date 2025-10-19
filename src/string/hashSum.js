/**
 * SPDX-License-Identifier: MIT
 * Modified hash-sum generation from https://github.com/bevacqua/hash-sum
 */
const fold = (hash, text) => {
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 4) - hash + text.charCodeAt(i)) | 0
  }
  return hash < 0 ? hash * -2 : hash
}

const getType = (any) => Object.prototype.toString.call(any).substring(8)

const stringify = (obj, visited = [], lastKey = '') => {
  const type = getType(obj)

  switch (type) {
    case 'Object]': {
      if (visited.includes(obj)) {
        return `[Circular]${lastKey}`
      }
      const out = []
      visited.push(obj)
      for (const key of Object.keys(obj).sort()) {
        const value = stringify(obj[key], visited, key)
        out.push([key, value].join(':'))
      }
      visited.pop()
      return `{${out.join(',')}}`
    }
    case 'Array]':
      return `[${obj.map((item) => stringify(item, visited)).join(',')}]`
    case 'Null]':
      return 'null'
    case 'Map]':
      return type + stringify(Object.fromEntries(obj), visited)
    case 'Set]':
      return type + stringify(Array.from(obj), visited)
    case 'Date]':
      return obj.toISOString()
    default:
      return String(obj)
  }
}

const foldValue = (value) => {
  const type = typeof value
  const string = stringify(value)
  return fold(fold(string.length, type), string)
}

/**
 * generate a hash value over value
 * @param {any} value
 * @returns {string}
 */
export const hashSum = (value) =>
  foldValue(value).toString(16).padStart(8, '0').substring(0, 8)
