
/**
 * converts a string of UTF-8 chars to a UTF-16 string
 * @param {string} strUtf8 UTF-8 string
 * @returns {string} UTF-16 string
 */
export function toUtf16 (strUtf8) {
  return decodeURIComponent(escape(strUtf8))
}

/**
 * converts a UTF-16 string to a string of UTF-8 chars
 * @param {string} str UTF-16 string
 * @returns {string} UTF-8 string
 */
export function toUtf8 (str) {
  return unescape(encodeURIComponent(str))
}

/**
 * convert utf8 to Uint8Array
 * @param {string} str
 * @return {Uint8Array}
 */
export function utf8ToUint8Array (str) {
  const array = new Uint8Array(str.length)
  for (let i = 0; i < array.length; i++) {
    array[i] = str.charCodeAt(i)
  }
  return array
}

/**
 * convert Uint8Array to utf8
 * @param {Uint8Array} arrUint8
 * @return {string}
 */
export function uint8ArrayToUtf8 (arrUint8) {
  let sUtf8 = ''
  for (const c of arrUint8) {
    sUtf8 += String.fromCharCode(c)
  }
  return sUtf8
}

/**
 * convert a utf16 string to utf8 and then to Uint8Array
 * @param {string} string
 * @return {Uint8Array}
 */
export function utf16ToUint8Array (string) {
  return utf8ToUint8Array(toUtf8(string))
}

/**
 * convert a Uint8Array to utf16 string
 * @param {Uint8Array} arrUint8
 * @return {string}
 */
export function uint8ArrayToUtf16 (arrUint8) {
  return toUtf16(uint8ArrayToUtf8(arrUint8))
}
