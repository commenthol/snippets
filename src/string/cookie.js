/**
 * parses a cookie string
 * @param {string} cookieStr
 * @returns {{[cookieName: string]: string}}
 */
export function cookieParse (cookieStr = '') {
  const parts = cookieStr.split(/\s*;\s*/)
  const cookies = {}
  for (const part of parts) {
    const [key, val] = part.split('=')
    if (key) {
      const value = decodeURIComponent(val)
      cookies[key] = value
    }
  }
  return cookies
}

/**
 * RegExp to match field-content in RFC 7230 sec 3.2
 *
 * field-content = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 * field-vchar   = VCHAR / obs-text
 * obs-text      = %x80-FF
 */
// eslint-disable-next-line no-control-regex
const fieldContentRegExp = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/

const isDate = d => !isNaN(new Date(d).getTime())

/**
 * serializes a cookie
 * @param {string} name
 * @param {any} value
 * @param {object} options
 * @param {number} [options.maxAge]
 * @param {string} [options.domain]
 * @param {string} [options.path]
 * @param {number|string|Date} [options.expires]
 * @param {boolean} [options.httpOnly=true]
 * @param {boolean} [options.secure=false]
 * @param {string|'Strict'|'Lax'|'None'|''|false} [options.sameSite='Strict']
 * @returns {string}
 */
export function cookieSerialize (name, value, options) {
  const {
    maxAge,
    domain,
    path,
    expires,
    httpOnly = true,
    secure = false,
    sameSite = 'Strict'
  } = options || {}

  if (!name || !fieldContentRegExp.test(name)) {
    throw TypeError('invalid name')
  }

  const parts = [`${name}=${encodeURIComponent(value)}`]

  if (!isNaN(maxAge - 0) && isFinite(maxAge)) {
    parts.push(`Max-Age=${maxAge}`)
  }
  if (domain && fieldContentRegExp.test(domain)) {
    parts.push(`Domain=${domain}`)
  }
  if (path && fieldContentRegExp.test(path)) {
    parts.push(`Path=${path}`)
  }
  if (isDate(expires)) {
    parts.push(`Expires=${new Date(expires).toUTCString()}`)
  }
  if (httpOnly) {
    parts.push('HttpOnly')
  }
  if (secure) {
    parts.push('Secure')
  }
  if (sameSite) {
    parts.push(`SameSite=${sameSite}`)
  }
  return parts.join('; ')
}
