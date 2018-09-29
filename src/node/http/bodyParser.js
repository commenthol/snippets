const httpError = require('./httpError')

const bodyParser = ({limit = 100000, abort} = {}) => (req, res, next) => {
  let body = ''

  req.on('data', chunk => {
    if ((body.length || chunk.length) < limit) {
      body += chunk.toString()
    } else if (abort) {
      req.destroy() // immediately abort the connection to free resources
      res.socket.destroy()
    } else {
      res.statusCode = 413
      res.end()
    }
  })
  req.on('end', () => {
    let err
    if (/\/json\b/.test(req.headers['content-type'])) {
      try {
        req.body = JSON.parse(body)
      } catch (e) {
        err = httpError(400, e, 'err_json_parse')
      }
    } else {
      req.body = body
    }
    next(err)
  })
  req.on('error', (err) => {
    next(err)
  })
}

module.exports = bodyParser
