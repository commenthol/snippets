/**
 * @param {Uint8Array} uint8
 * @returns {string} base64 encoded string
 */
export const uint8ToBase64 = (uint8) => btoa(String.fromCodePoint(...uint8))

/**
 * @param {string} b64Encoded base64 encoded string
 * @returns {Uint8Array}
 */
export const base64ToUint8 = (b64Encoded) =>
  // @ts-ignore
  Uint8Array.from(atob(b64Encoded), (c) => c.codePointAt(0))

/**
 * @param {string} str utf16 or javascript string
 * @returns {string} base64 encoded string
 */
export const toBase64 = (str) => uint8ToBase64(new TextEncoder().encode(str))

/**
 * @param {string} b64Encoded utf16 or javascript string
 * @returns {string} base64 encoded string
 */
export const fromBase64 = (b64Encoded) =>
  new TextDecoder().decode(base64ToUint8(b64Encoded))
