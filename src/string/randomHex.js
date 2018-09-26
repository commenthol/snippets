/**
 * generate a random hexadecimal number as string
 * NOTE: Do not use for crypto purposes
 * @example
 * randomHex() //> c165a012bdf67bd1
 */
export const randomHex = (length = 16) =>
  Array(length).fill(1).map(() => Math.random().toString(16)[3] || '0').join('')
