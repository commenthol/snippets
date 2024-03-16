import crypto from 'node:crypto'

/**
 * String comparison in length constant time
 *
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

/**
 * String comparison in length constant time using crypto.timingSafeEqual with
 * Buffers
 *
 * @param {string} a input; secret from others
 * @param {string} b secret for comparison
 */
export const timingSafeEqualNode = (a, b = '') => {
  if (!a || typeof a !== 'string' || typeof b !== 'string') {
    return false
  }
  const size = a.length
  const bufA = Buffer.alloc(size, a)
  const bufB = Buffer.alloc(size, b)
  return size > 0 && crypto.timingSafeEqual(bufA, bufB) && a === b
}
