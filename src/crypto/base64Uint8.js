/**
 * @param {Uint8Array} uint8
 * @returns {string} base64 encoded string
 */
export const uint8ToBase64 = (uint8) => {
  const out = []
  for (const n of uint8) {
    out.push(String.fromCharCode(n))
  }
  return btoa(out.join(''))
}

/**
 * @param {string} b64Encoded base64 encoded string
 * @returns {Uint8Array}
 */
export const base64ToUint8 = (b64Encoded) =>
  Uint8Array.from(atob(b64Encoded).split('').map(c => c.charCodeAt(0)))
