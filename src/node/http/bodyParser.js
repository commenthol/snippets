import { HttpError } from './HttpError.js'

/**
 * @param {object} [param0]
 * @param {number} [param0.limit=100000] max body size in bytes
 * @returns {import('./connect-types.js').NextHandleFunction}
 */
export const bodyParser = ({ limit = 100000 } = {}) =>
  function bodyParser(req, _res, next) {
    let body = ''

    const contentLength =
      req.headers['content-length'] === undefined
        ? NaN
        : parseInt(req.headers['content-length'], 10)

    if (contentLength > limit) {
      removeListeners()
      next(new HttpError(413, 'err_limit'))
      return
    }

    req.on('data', onData)
    req.on('end', onEnd)
    req.on('error', onEnd)

    function removeListeners() {
      req.removeListener('data', onData)
      req.removeListener('end', onEnd)
      req.removeListener('error', onEnd)
    }
    function onData(chunk) {
      if ((body.length || chunk.length) < limit) {
        body += chunk.toString()
      } else {
        removeListeners()
        next(new HttpError(413, 'err_limit'))
      }
    }
    function onEnd(err) {
      removeListeners()
      if (isNaN(contentLength) && contentLength !== body.length) {
        next(new HttpError(400, 'err_content_length'))
        return
      }

      req.text = body
      const contentType = req.headers['content-type'] || ''

      if (contentType.indexOf('application/json') === 0) {
        try {
          req.body = JSON.parse(body)
        } catch (/** @type {any} */ e) {
          err = new HttpError(400, 'err_json_parse', e)
        }
      } else if (
        contentType.indexOf('application/x-www-form-urlencoded') === 0
      ) {
        try {
          const encoded = Array.from(new URLSearchParams(body)).reduce(
            (o, [k, v]) => {
              o[k] = urlDecode(v)
              return o
            },
            {}
          )
          req.body = encoded
        } catch (/** @type {any} */ e) {
          err = new HttpError(400, 'err_urlencoded_parse', e)
        }
      }
      next(err)
    }
  }

function urlDecode(v) {
  const n = Number(v)
  return isNaN(n) ? v : n
}
