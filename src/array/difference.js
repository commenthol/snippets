/**
 * Creates an array of array values not included in the other arrays
 * @param {any[]} array
 * @param {any[]} values
 * @returns {any[]}
 */
export const difference = (array, values) =>
  array.filter((value) => values.indexOf(value) === -1)
