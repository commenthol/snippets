/**
 * @param {number} ms sleep timeout in milliseconds
 * @returns {Promise<void>}
 */
export const sleep = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))
