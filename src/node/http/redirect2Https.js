
function redirect (res, url, status = 302) {
  res.statusCode = status
  res.setHeader('Location', url)
  res.end()
}

/**
 * A connect middleware to redirect from http to https
 * @param {string} redirectUrl
 * @param {number} [statusCode] redirect status code; defaults to 301
 * @returns
 */
export function redirect2Https (redirectUrl, statusCode) {
  if (redirectUrl && redirectUrl.indexOf('https://') !== 0) {
    throw new Error('redirectUrl needs to use https:// as protocol')
  }

  return function redirect2Https (req, res, next) {
    const xForwardedProto = req.headers['x-forwarded-proto']
    const { protocol } = req
    if ((protocol === 'https') || (protocol === 'http' && xForwardedProto === 'https')) {
      next()
    } else {
      const { url } = req
      const { host } = req.headers
      const url_ = url === '/' ? '' : url
      redirect(res, redirectUrl || `https://${host}${url_}`, statusCode)
    }
  }
}
