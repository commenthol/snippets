
const timeoutBreaker = (timeout = 5000) => (req, res, next) => {
  const timerId = setTimeout(() => {
    const { method, url } = req
    const error = 'Request took too long to process'
    res.statusCode = 500

    if (/\/json/.test(req.headers.accept || '')) {
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error }))
    } else {
      res.setHeader('Content-Type', 'text/plain')
      res.end(error)
    }

    // eslint-disable-next-line no-console
    console.log('Error: %s %s Request took too long. Ended after %s ms', method, url, timeout)
  }, timeout)

  res.on('finish', () => {
    clearTimeout(timerId)
  })
  next()
}

// module.exports = timeoutBreaker
export default timeoutBreaker
