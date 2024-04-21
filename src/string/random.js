// only needed on node
import { webcrypto as crypto } from 'node:crypto'

const ALPHABET = '0123456789' +
  'abcdefghijklmnopqrstuvwxyz' +
  'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
  '_-'

/**
 * generate a random string composed of `alphabet` chars; default [0-9a-zA-Z_-]
 * @param {number} [length=21] of string
 * @param {string} [alphabet] allowed characters
 * @returns {string}
 */
export const random = (length = 21, alphabet = ALPHABET) => {
  const rand = crypto.getRandomValues(new Uint8Array(length))
  let str = ''
  for (let i = 0; i < length; i += 1) {
    str += alphabet[rand[i] % alphabet.length]
  }
  return str
}
