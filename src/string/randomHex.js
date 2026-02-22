/**
 * generate a random hexadecimal number as string
 * NOTE: Do not use for crypto purposes
 * @example
 * randomHex() //> c165a012bdf67bd1
 */
export const randomHex = (length = 16) => {
  let str = ''
  while (str.length < length) {
    str += Math.random().toString(16).slice(2)
  }
  return str.substring(0, length)
}

/**
 * faster alternative which returns 13 byte long random hex string
 * @return {string}
 */
export const fastRandomHex = () =>
  ((Math.random() + Math.random()).toString(16) + '0000000000000').substring(
    2,
    15
  )
