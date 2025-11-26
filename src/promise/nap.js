/**
 * @param {number} [ms=100] nap timeout in milliseconds
 * @returns {Promise<void>}
 */
export const nap = (ms = 100) =>
  new Promise((resolve) => setTimeout(resolve, ms).unref())

/**
 * @returns {Promise<void>}
 */
export const immediate = () =>
  new Promise((resolve) => setImmediate(resolve).unref())

/**
 * @returns {Promise<void>}
 */
export const nextTick = () =>
  new Promise((resolve) => process.nextTick(resolve))
