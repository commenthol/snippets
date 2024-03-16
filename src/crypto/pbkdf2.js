const lengthMap = {
  'SHA-1': 160,
  'SHA-256': 256,
  'SHA-384': 384,
  'SHA-512': 512
}
const getDerivedBitsLen = (alg) => lengthMap[alg] || 256

const getSaltLen = (alg, saltLength = 32) =>
  Math.floor(Math.max(getDerivedBitsLen(alg) / 8), saltLength)

/**
 * @param {string} secret
 * @param {{
 *  alg?: string
 *  iterations?: number
 *  salt?: Uint8Array
 *  saltLength?: number
 * }} options
 * @returns {Promise<{
 *  alg: string
 *  iterations; number
 *  salt: Uint8Array
 *  hash: Uint8Array
 * }>}
 */
export async function pbkdf2 (secret, options) {
  const {
    alg = 'SHA-256',
    iterations = 6e5,
    salt: _salt,
    saltLength: _saltLength
  } = options || {}

  const saltLength = getSaltLen(alg, _saltLength)
  const salt = _salt || new Uint8Array(saltLength)
  if (!_salt) {
    crypto.getRandomValues(salt)
  }

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret.normalize('NFC')),
    { name: 'PBKDF2' },
    false, // not extractable
    ['deriveBits', 'deriveKey']
  )

  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations,
      hash: { name: alg }
    },
    keyMaterial,
    getDerivedBitsLen(alg)
  )

  return { alg, iterations, salt, hash: new Uint8Array(hash) }
}
