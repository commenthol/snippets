const httpError = require('./httpError')

const bodyParser = ({ limit = 100000 } = {}) => (req, res, next) => {
  let body = ''

  const contentLength = req.headers['content-length'] === undefined
    ? NaN
    : parseInt(req.headers['content-length'], 10)

  if (contentLength > limit) {
    next(httpError(413))
    return
  }

  req.on('data', onData)
  req.on('end', onEnd)
  req.on('error', onEnd)

  function removeListeners () {
    req.removeListener('data', onData)
    req.removeListener('end', onEnd)
    req.removeListener('error', onEnd)
  }
  function onData (chunk) {
    if ((body.length || chunk.length) < limit) {
      body += chunk.toString()
    } else {
      removeListeners()
      next(httpError(413))
    }
  }
  function onEnd (err) {
    removeListeners()
    if (isNaN(contentLength) && contentLength !== body.length) {
      next(httpError(400))
      return
    }
    if (/^application\/json\b/.test(req.headers['content-type'])) {
      try {
        req.body = JSON.parse(body)
      } catch (e) {
        err = httpError(400, e, 'err_json_parse')
      }
    } else {
      req.body = body
    }
    next(err)
  }
}

module.exports = bodyParser
