/**
 * Hash value
 * @param {string|BufferSource} value
 * @param {string} [alg='SHA-256'] possible values `SHA-1|SHA-256|SHA-384|SHA-512`
 * @returns {Promise<Uint8Array>}
 */
export async function sha (value, alg = 'SHA-256') {
  const buf = typeof value === 'string'
    ? new TextEncoder().encode(value)
    : value

  const hash = await crypto.subtle.digest({ name: alg }, buf)
  return new Uint8Array(hash)
}
