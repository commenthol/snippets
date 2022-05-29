import http from 'http'
import https from 'https'

export function fetch (url, opts) {
  const { protocol, hostname, port, pathname, search } = new URL(url)
  const { body, ..._opts } = opts || {}
  const path = pathname + search
  const transport = protocol === 'http:' ? http : https
  const req = transport.request({ ..._opts, hostname, port, path })
  const then = (_resolve) =>
    new Promise((resolve, reject) => {
      req.once('response', res => {
        let text = ''
        res.status = res.statusCode
        res.ok = res.status < 300
        res.headers = Object.entries(res.headers)
        res.text = async () => text
        res.json = async () => JSON.parse(text)
        res.on('data', (data) => { text += data.toString() })
        res.on('error', reject)
        res.on('end', () => resolve(res))
        req.on('error', reject)
      })
    }).then(_resolve)
  req.end(body)

  // non standard
  function pipe (stream) {
    req.once('response', res => res.pipe(stream))
  }

  return { then, pipe }
}
