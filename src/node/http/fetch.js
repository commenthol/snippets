import http from 'http'
import https from 'https'

export function fetch (url, options = {}) {
  const { protocol, hostname, port, pathname, search } = new URL(url)
  const { body, timeout = 5e3, deadline = 60e3, ..._opts } = options || {}
  const path = pathname + search
  const transport = protocol === 'http:' ? http : https
  const req = transport.request({ ..._opts, hostname, port, path })

  const timer = (ms) => setTimeout(() => {
    req.destroyed = true
    req.abort()
  }, ms)

  const timeoutId = timer(timeout)
  const deadlineId = timer(deadline)

  const then = (_resolve) =>
    new Promise((resolve, reject) => {
      req.once('response', res => {
        clearTimeout(timeoutId)
        if (res.statusCode >= 300 && res.statusCode <= 400) {
        console.error(res.statusCode, res.headers.location) // eslint-disable-line
          reject(new Error('redirect not supported'))
          return
        }
        let text = ''
        res.status = res.statusCode
        res.ok = res.status < 300
        res.headers = Object.entries(res.headers)
        res.text = async () => text
        res.json = async () => JSON.parse(text)
        res.on('data', (data) => { text += data.toString() })
        res.once('error', reject)
        res.once('end', () => {
          clearTimeout(deadlineId)
          resolve(res)
        })
      })
      req.on('error', reject)
    }).then(_resolve)
  req.end(body)

  // non standard
  function pipe (stream) {
    req.once('response', res => {
      clearTimeout(timeoutId)
      res.once('end', () => {
        clearTimeout(deadlineId)
      })
      res.pipe(stream)
    })
  }

  return { then, pipe }
}
