import { isObject } from './isObject.js'

/**
 * merge objects
 * does not break on circularities
 * @param  {...Object} sources
 * @return {Object}
 */
export const mergeObj = (...sources) =>
  [...sources].reduce((acc, source) => {
    if (!source || typeof source !== 'object') return source
    Object.keys(source).forEach((k) => {
      acc[k] =
        Object.prototype.hasOwnProperty.call(acc, k) &&
        typeof acc[k] === 'object'
          ? mergeObj(acc[k], source[k])
          : source[k]
    })
    return acc
  }, {})

/**
 * merge objects and arrays
 * does NOT do circular checks!
 * @template T
 * @param {Array<Partial<T> | undefined>} sources
 * @returns {T}
 */
export const merge = (...sources) => {
  /** @type {any} */
  let target = {}

  for (const source of sources) {
    if (Array.isArray(source)) {
      if (!Array.isArray(target)) {
        target = []
      }
      target = [...target, ...source]
    } else if (isObject(source)) {
      // @ts-expect-error
      for (let [key, value] of Object.entries(source)) {
        if (isObject(value) && !propertyIsUnsafe(target, key)) {
          value = merge(target[key], value)
        }
        target = { ...target, [key]: value }
      }
    }
  }

  return target
}

/**
 * @private
 * @param {any} target
 * @param {string} key
 * @returns {boolean}
 */
const propertyIsUnsafe = (target, key) =>
  key in target &&
  (!Object.hasOwnProperty.call(target, key) || // unsafe if they exist up the prototype chain,
    !Object.propertyIsEnumerable.call(target, key))
