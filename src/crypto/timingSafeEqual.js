import crypto from 'node:crypto'

/**
 * String comparison in length constant time
 *
 * @param {string} trusted secret for comparison
 * @param {string} untrusted input; secret from others
 */
export const timingSafeEqual = (trusted, untrusted = '') => {
  if (
    !trusted ||
    !untrusted ||
    typeof trusted !== 'string' ||
    typeof untrusted !== 'string'
  ) {
    return false
  }

  let check = trusted.length === untrusted.length
  for (let i = 0, l = untrusted.length; i < l; i++) {
    check &&= trusted.charAt(i) === untrusted.charAt(i)
  }

  return check
}

/**
 * String comparison in length constant time using crypto.timingSafeEqual with
 * Buffers
 *
 * @param {string} trusted trusted input; secret for comparison
 * @param {string} untrusted secret from others
 */
export const timingSafeEqualNode = (trusted, untrusted = '') => {
  if (
    !trusted ||
    !untrusted ||
    typeof trusted !== 'string' ||
    typeof untrusted !== 'string'
  ) {
    return false
  }
  const bufUntrusted = Buffer.from(untrusted)
  if (trusted.length !== untrusted.length) {
    // Avoid timing attacks by comparing with itself
    crypto.timingSafeEqual(bufUntrusted, bufUntrusted)
    return false
  }
  return crypto.timingSafeEqual(Buffer.from(trusted), bufUntrusted)
}
