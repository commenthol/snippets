/**
 * capitalize the first letter
 * @param {string} str
 * @returns {string}
 */
export const capitalizeFirstLetter = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Provides conversion functions which works reliable in both ways
 */

/**
 * convert lowerCamelCase to snake_case
 * @param {string} str
 * @returns {string}
 */
export const camelToSnakeCase = (str = '') =>
  str.replace(/([A-Z])/g, (_, m) => `_${m.toLowerCase()}`).replace(/^_+/, '')

/**
 * convert snake_case to lowerCamelCase
 * @param {string} str
 * @returns {string}
 */
export const snakeToCamelCase = (str = '') =>
  str.toLowerCase().replace(/_(\w)/g, (_, m) => m.toUpperCase())

/**
 * convert lowerCamelCase to kebab-case
 * @param {string} str
 * @returns {string}
 */
export const camelToKebabCase = (str = '') =>
  str.replace(/([A-Z])/g, (_, m) => `-${m.toLowerCase()}`)

/**
 * convert kebab-case to lowerCamelCase
 * @param {string} str
 * @returns {string}
 */
export const kebabToCamelCase = (str = '') =>
  str.toLowerCase().replace(/[-_]\w/g, (m) => m[1].toUpperCase())
