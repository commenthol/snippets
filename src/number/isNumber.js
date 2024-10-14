/**
 * checks if the given value is a number
 * @param {any} num
 * @returns {boolean}
 */
export const isNumber = (num) => {
  switch (typeof num) {
    case 'number':
      // NaN - NaN === NaN
      return num - num === 0
    case 'string':
      // +'' === 0 && num <> Inifinity
      return num.trim() !== '' && Number.isFinite(+num)
    default:
      // all other types
      return false
  }
}
