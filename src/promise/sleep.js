/**
 * @param {number} ms sleep timeout in milliseconds
 * @returns {Promise<number>}
 */
export const sleep = (ms) =>
  new Promise((resolve) => setTimeout(() => resolve(ms), ms))
