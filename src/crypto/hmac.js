/**
 * @param {string} secret
 * @param {string} [alg] - SHA-1|SHA-256|SHA-384|SHA-512
 * @returns {Promise<CryptoKey>}
 */
export function hmacImportKey(secret, alg = 'SHA-256') {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret.normalize('NFC')),
    {
      name: 'HMAC',
      hash: { name: alg },
    },
    false,
    ['sign', 'verify']
  )
}

/**
 * @param {string} secret
 * @param {Uint8Array} data
 * @param {string} [alg] - SHA-1|SHA-256|SHA-384|SHA-512
 * @returns {Promise<Uint8Array>}
 */
export async function hmacSign(secret, data, alg) {
  const keyMaterial =
    typeof secret === 'string' ? await hmacImportKey(secret, alg) : secret
  // @ts-expect-error
  const hash = await crypto.subtle.sign({ name: 'HMAC' }, keyMaterial, data)
  return new Uint8Array(hash)
}

/**
 * @param {string} secret
 * @param {Uint8Array} signature
 * @param {Uint8Array} data
 * @param {string} [alg] - SHA-1|SHA-256|SHA-384|SHA-512
 * @returns {Promise<boolean>}
 */
export async function hmacVerify(secret, signature, data, alg) {
  const keyMaterial =
    typeof secret === 'string' ? await hmacImportKey(secret, alg) : secret

  const isEqual = await crypto.subtle.verify(
    { name: 'HMAC' },
    keyMaterial,
    // @ts-expect-error
    signature,
    data
  )
  return isEqual
}
