/**
 * cookie parser and response set cookie functions
 * for [restana](https://npmjs.com/package/restana) or legacy http servers
 */

import cookie from 'cookie'

const COOKIE_DEFAULTS = {
  path: '/',
  domain: undefined,
  sameSite: 'strict',
  httpOnly: true
}

/**
 * @typedef {object} CookieOptions
 * @property {string} [domain]
 * @property {Date} [expires]
 * @property {boolean} [httpOnly=true]
 * @property {number} [maxAge] in seconds
 * @property {string} [path='/']
 * @property {boolean} [secure]
 * @property {'strict'|'lax'|'none'|boolean} [sameSite='strict']
 */

/**
 * connect middleware adding request cookie parsing and response set cookie
 * functionality
 *
 * sets `secure` cookie by default if `req.protocol` or
 * `req.headers['x-forwarded-proto']` is `https`
 *
 * @example
 * ```js
 * app.use(
 *   cookieParser,
 *   (req, res, next) => {
 *     console.log(req.cookies) // get cookies object
 *     res.cookie('foo', 'bar', { maxAge: 3600, path: '/test' }) // set cookie
 *     res.clearCookie('test') // clear cookie
 *     next()
 *   }
 * )
 * ```
 *
 * @param {any} req
 * @param {any} res
 * @param {Function} next
 */
export function cookieParser (req, res, next) {
  cookies(req)
  res._protocol = req.headers['x-forwarded-proto'] || req.protocol
  res.cookie = setCookie.bind(undefined, res)
  res.clearCookie = clearCookie.bind(undefined, res)
  next()
}

/**
 * parse the request cookie header
 * @param {any} req Request
 * @returns {object} cookie names and values
 */
export function cookies (req) {
  req.cookies = cookie.parse(req.headers.cookie || '')
  return req.cookies
}

/**
 * set cookie on response
 * @param {any} res Response
 * @param {string} name
 * @param {string} [value='']
 * @param {CookieOptions} [options]
 */
export function setCookie (res, name, value = '', options = {}) {
  const opts = {
    ...COOKIE_DEFAULTS,
    secure: res._protocol === 'https',
    ...options
  }
  const setCookie = cookie.serialize(name, value, opts)
  const prev = res.getHeader('set-cookie') || []
  res.setHeader('set-cookie', [...prev, setCookie])
}

/**
 * clear a cookie
 * @param {any} res Response
 * @param {string} name
 * @param {CookieOptions} [options]
 */
export function clearCookie (res, name, options) {
  setCookie(res, name, '', { ...options, expires: new Date(0) })
}
