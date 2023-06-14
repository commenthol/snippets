/**
 * @param {Uint8Array} uint8
 * @returns {string} hex encoded string
 */
export const uint8ToHex = (uint8) => {
  const out = []
  for (const n of uint8) {
    out.push(n.toString(16).padStart(2, '0'))
  }
  return out.join('')
}

/**
 * @param {string} hexEncoded hex encoded string
 * @returns {Uint8Array}
 */
export const hexToUint8 = (hexEncoded) => {
  const arr = []
  for (let i = 0; i < hexEncoded.length; i += 2) {
    const hex = hexEncoded.substring(i, i + 2)
    const num = parseInt(hex, 16)
    if (isNaN(num)) break
    arr.push(num)
  }
  return Uint8Array.from(arr)
}
