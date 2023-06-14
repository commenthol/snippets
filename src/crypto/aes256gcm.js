import { base64ToUint8, uint8ToBase64 } from './base64Uint8.js'
import { hexToUint8, uint8ToHex } from './hexUint8.js'
import { promisify } from 'util'

const napTick = promisify(process.nextTick)

/** derived key variants */
const variants = {
  0: { hash: 'SHA-256', saltLength: 32, iterations: 600e3 },
  1: { hash: 'SHA-512', saltLength: 32, iterations: 120e3 }
}

/**
 * key derivation needs quite some time. Consider running in Worker.
 * @param {string} secret
 * @param {{
 *  variant?: number
 *  salt?: Uint8Array
 * }} [options]
 * @returns {Promise<{{key: CryptoKey, iv: Uint8Array, variant: number}}>}
 */
export const getDerivedKey = async (secret, options) => {
  const { salt: _salt, variant = 0 } = options || {}
  const { hash, iterations, saltLength } = variants[variant]
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
    hash
  }
  const hmacKey = await crypto.subtle.deriveKey(
    algo,
    keyMaterial,
    { name: 'HMAC', hash },
    true,
    ['sign', 'verify']
  )
  await napTick()
  const iv = await crypto.subtle.exportKey('raw', hmacKey)
  const key = await crypto.subtle.deriveKey(
    algo,
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  )
  await napTick()
  return { key, iv, salt, variant }
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
  crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, uint8)

/**
 * resulting format
 * ```
 * | variant | salt             | cipher              |
 * | 1 byte  | saltLength bytes | cipher.length bytes |
 * ```
 * @param {string|Uint8Array} data
 * @param {{
 *  key: CryptoKey,
 *  iv: Uint8Array,
 *  variant: number
 * }} derivedKey
 * @param {{
 *  encoding?: string
 * }} [options]
 * @returns
 */
export const encrypt = async (data, derivedKey, options) => {
  const { encoding = 'hex' } = options || {}
  const { key, iv, salt, variant } = derivedKey
  const cipher = new Uint8Array(await encryptBuffer(data, { key, iv }))
  const size = 1 + salt.length + cipher.length
  const uBuf = new Uint8Array(size)
  uBuf[0] = variant
  let offset = 0
  uBuf.set(salt, (offset += 1))
  uBuf.set(cipher, (offset += salt.length))
  return encoding === 'hex'
    ? uint8ToHex(uBuf)
    : encoding === 'base64'
      ? uint8ToBase64(uBuf)
      : uBuf
}

/**
 * @param {string} cipherText
 * @param {string} secret
 * @param {{
 *  encoding?: string
 *  raw?: boolean
 * }} [options]
 * @returns {Promise<}
 */
export const decrypt = async (cipherText, secret, options) => {
  const { encoding = 'hex', raw = false } = options || {}
  const uBuf =
    encoding === 'hex'
      ? hexToUint8(cipherText)
      : encoding === 'base64'
        ? base64ToUint8(cipherText)
        : cipherText
  let offset = 0
  const variant = uBuf[offset]
  const { hash, saltLength } = variants[variant] || {}
  if (!hash) throw new Error('Unknown variant')
  const salt = uBuf.slice((offset += 1), (offset += saltLength))
  const cipher = uBuf.slice(offset, uBuf.length)
  const { key, iv } = await getDerivedKey(secret, { salt, variant })
  const data = await decryptBuffer(cipher, { key, iv })
  return raw ? data : new TextDecoder().decode(data)
}
