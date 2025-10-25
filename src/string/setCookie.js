// SPDX-License-Identifier: Unlicense
/**
 * @license Unlicense
 * @see https://github.com/commenthol/snippets
 */

const isDate = (date) => !isNaN(date.getTime())

const allowedCookieNameChars = /^[!#$%&'*+^_`|~0-9A-Za-z-]+$/

const sameSiteMap = {
  none: 'None',
  lax: 'Lax',
  strict: 'Strict',
}

/**
 * @param {string|string[]} setCookieHeader
 * @returns {{}|Record<string, {
 *  value: string
 *  expires?: Date
 *  domain?: string
 *  path?: string
 *  secure?: boolean
 *  httpOnly?: boolean
 *  sameSite?: 'Strict'|'Lax'|'None'
 * }>}
 */
export function setCookieParse(setCookieHeader) {
  const headers = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader]
  const result = {}
  for (const header of headers) {
    const parts = header.split(/;\s*/)
    let tmp = {}
    for (let i = 0; i < parts.length; i++) {
      const [key, val] = parts[i].split('=')
      if (i === 0) {
        try {
          if (!allowedCookieNameChars.test(key)) {
            throw new Error()
          }
          let value = decodeURIComponent(val)
          if (value[0] === '"' && value[value.length - 1] === '"') {
            value = value.slice(1, -1)
          }
          tmp = result[key] = { value }
        } catch (_err) {
          i = parts.length
        }
        continue
      }
      switch (key.toLowerCase()) {
        case 'expires': {
          // max-age has precedence
          if (tmp.expires) break
          const date = new Date(val)
          if (isDate(date)) {
            tmp.expires = date
          }
          break
        }
        case 'max-age': {
          const ms = Number(val) * 1000
          if (!Number.isSafeInteger(ms) || ms < 0) break
          tmp.expires = new Date(Date.now() + ms)
          break
        }
        case 'domain':
          tmp.domain = val
          break
        case 'path':
          if (val[0] !== '/') break
          tmp.path = val
          break
        case 'secure':
          tmp.secure = true
          break
        case 'httponly':
          tmp.httpOnly = true
          break
        case 'samesite': {
          const v = sameSiteMap[val.toLowerCase()]
          if (!v) break
          tmp.sameSite = v
          break
        }
      }
    }
  }
  return result
}
