/**
 * check if object is empty
 */
export const isEmpty = (obj) => obj === null ||
  obj === undefined ||
  (typeof obj === 'object' && !Object.keys(obj).length)
