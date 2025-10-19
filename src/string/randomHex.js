/**
 * generate a random hexadecimal number as string
 * NOTE: Do not use for crypto purposes
 * @example
 * randomHex() //> c165a012bdf67bd1
 */
export const randomHex = (length = 16) =>
  Array(length)
    .fill(1)
    .map(() => Math.random().toString(16)[3] || '0')
    .join('')

/**
 * faster alternative which returns 13 byte long random hex string
 * @return {string}
 */
export const fastRandomHex = () =>
  ((Math.random() + Math.random()).toString(16) + '0000000000000').substring(
    2,
    15
  )
