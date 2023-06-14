/**
 * replacement for deprecated `unescape()`
 * @param {string} str
 * @returns {string}
 */
const unescape = (str) =>
  str.replace(RE_UNESC, (_, m) => String.fromCharCode('0x' + m))
const RE_UNESC = /%([0-9A-F]{2})/g

/**
 * replacement for deprecated `escape()`
 * @param {string} str
 * @returns {string}
 */
const escape = (str) =>
  str
    .split('')
    .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')

/**
 * @param {string} str
 * @returns {string} base64 encoded string
 */
export const base64Encode = (str) => btoa(unescape(encodeURIComponent(str)))

/**
 *
 * @param {string} b64Encoded base64 encoded string
 * @returns {string}
 */
export const base64Decode = (b64Encoded) =>
  decodeURIComponent(escape(atob(b64Encoded)))
