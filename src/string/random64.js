// only needed on node
import { webcrypto as crypto } from 'node:crypto'

/**
 * generate a random string composed of chars [0-9a-zA-Z_-]
 * with length = 21 same entropy as with uuid can be achieved
 * (random64) 64^21 > (uuid4) 16^31
 * @param {number} [length=21] of string
 * @returns {string}
 */
export const random64 = (length = 21) => {
  const rand = crypto.getRandomValues(new Uint8Array(length))
  let str = ''
  for (let i = 0; i < length; i += 1) {
    let byte = rand[i]
    str += (byte &= 63) < 36
      ? byte.toString(36) // 0-9 a-z
      : byte < 62
        ? (byte - 26).toString(36).toUpperCase() // A-Z
        : byte > 62
          ? '_' // e == 63
          : '-' // e == 62
  }
  return str
}
