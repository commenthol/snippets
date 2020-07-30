
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

export function utf8ToUint8Array (str) {
  const array = new Uint8Array(str.length)
  for (let i = 0; i < array.length; i++) {
    array[i] = str.charCodeAt(i)
  }
  return array
}

export function uint8ArrayToUtf8 (arrUint8) {
  var sUtf8 = ''
  for (const c of arrUint8) {
    sUtf8 += String.fromCharCode(c)
  }
  return sUtf8
}
