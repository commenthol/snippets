/**
 * @param {string} a input; secret from others
 * @param {string} b secret for comparison
 */
export const timingSafeEqual = (a, b = '') => {
  if (!a || typeof a !== 'string' || typeof b !== 'string') {
    return false
  }

  let check = a.length === b.length
  for (let i = 0; i < a.length; i++) {
    check &&= a[i] === b[i]
  }

  return check
}
