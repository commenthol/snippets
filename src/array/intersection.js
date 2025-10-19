/**
 * @param {any[]} arr
 * @param {any[]} comp
 * @returns {any[]} overlapping values
 */
export const intersection = (arr, comp) =>
  arr.filter((item) => comp.some((el) => el === item))
