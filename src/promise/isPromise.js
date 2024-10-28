/**
 * tests if val is a promise or async function
 * @param {any} val
 * @returns {boolean}
 */
export const isPromise = (val) =>
  typeof val?.then === 'function' || val[Symbol.toStringTag] === 'AsyncFunction'
