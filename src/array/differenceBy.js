/**
 * @param {any[]} array The array to inspect
 * @param {any[]} values The values to exclude
 * @param {Function|string} iteratee The iteratee invoked per element
 * @returns
 */
export const differenceBy = (array, values, iteratee) => {
  if (typeof iteratee === 'string') {
    const prop = iteratee
    iteratee = (item) => item[prop]
  }
  return array.filter(
    (value) => !values.map((item) => iteratee(item)).includes(iteratee(value))
  )
}
