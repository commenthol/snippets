import { base64ToUint8, uint8ToBase64 } from './base64Uint8.js'
import { hexToUint8, uint8ToHex } from './hexUint8.js'
import { promisify } from 'util'

const napTick = promisify(process.nextTick)

/** derived key variants */
const variants = {
  0: { hash: 'SHA-256', saltLength: 32, iterations: 600e3, ivLength: 12 },
  1: { hash: 'SHA-512', saltLength: 32, iterations: 120e3, ivLength: 12 },
}

/**
 * key derivation needs quite some time. Consider running in Worker.
 * @param {string} secret
 * @param {{
 *  variant?: number
 *  salt?: Uint8Array
 * }} [options]
 * @returns {Promise<{key: CryptoKey, salt: Uint8Array, iv: Uint8Array, variant: number}>}
 */
export const getDerivedKey = async (secret, options) => {
  const { salt: _salt, variant = 0 } = options || {}
  const { hash, iterations, saltLength, ivLength } = variants[variant]
  const salt = _salt || crypto.getRandomValues(new Uint8Array(saltLength))

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  )

  const algo = {
    name: 'PBKDF2',
    salt,
    iterations,
    hash,
  }
  const key = await crypto.subtle.deriveKey(
    algo,
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
  await napTick()
  const iv = crypto.getRandomValues(new Uint8Array(ivLength))
  return { key, salt, iv, variant }
}

/**
 * @param {string|Uint8Array} data
 * @param {{
 *  key: CryptoKey,
 *  iv: Uint8Array
 * }} derivedKey
 * @returns {Promise<ArrayBuffer>}
 */
export const encryptBuffer = (data, { key, iv }) =>
  crypto.subtle.encrypt(
    // @ts-expect-error
    { name: 'AES-GCM', iv },
    key,
    typeof data === 'string' ? new TextEncoder().encode(data) : data
  )

/**
 * @param {Uint8Array} uint8
 * @param {{
 *  key: CryptoKey,
 *  iv: Uint8Array
 * }} derivedKey
 * @returns {Promise<ArrayBuffer>}
 */
export const decryptBuffer = (uint8, { key, iv }) =>
  // @ts-expect-error
  crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, uint8)

/**
 * resulting format
 * ```
 * | variant | salt             | iv             | cipher              |
 * | 1 byte  | saltLength bytes | ivLength bytes | cipher.length bytes |
 * ```
 * @param {string|Uint8Array} data
 * @param {{
 *  key: CryptoKey,
 *  iv: Uint8Array,
 *  salt: Uint8Array,
 *  variant: number
 * }} derivedKey
 * @param {{
 *  encoding?: string
 * }} [options]
 * @returns {Promise<string|Uint8Array>}
 */
export const encrypt = async (data, derivedKey, options) => {
  const { encoding = 'hex' } = options || {}
  const { key, salt, iv, variant } = derivedKey
  const cipher = new Uint8Array(await encryptBuffer(data, { key, iv }))
  const size = 1 + salt.length + iv.length + cipher.length
  const uBuf = new Uint8Array(size)
  uBuf[0] = variant
  let offset = 0
  uBuf.set(salt, (offset += 1))
  uBuf.set(iv, (offset += salt.length))
  uBuf.set(cipher, (offset += iv.length))
  return encoding === 'hex'
    ? uint8ToHex(uBuf)
    : encoding === 'base64'
      ? uint8ToBase64(uBuf)
      : uBuf
}

/**
 * @param {string|Uint8Array} cipherText
 * @param {string} secret
 * @param {{
 *  encoding?: string
 *  raw?: boolean
 * }} [options]
 * @returns {Promise<string|ArrayBuffer>}
 */
export const decrypt = async (cipherText, secret, options) => {
  const { encoding = 'hex', raw = false } = options || {}
  const uBuf =
    cipherText instanceof Uint8Array
      ? cipherText
      : encoding === 'hex'
        ? hexToUint8(cipherText)
        : encoding === 'base64'
          ? base64ToUint8(cipherText)
          : undefined
  if (!uBuf) throw new Error('Invalid cipherText input')
  let offset = 0
  const variant = uBuf[offset]
  const { hash, saltLength, ivLength } = variants[variant] || {}
  if (!hash) throw new Error('Unknown variant')
  const salt = uBuf.slice((offset += 1), (offset += saltLength))
  const iv = uBuf.slice(offset, (offset += ivLength))
  const cipher = uBuf.slice(offset, uBuf.length)
  const { key } = await getDerivedKey(secret, { salt, variant })
  const data = await decryptBuffer(cipher, { key, iv })
  return raw ? data : new TextDecoder().decode(data)
}
