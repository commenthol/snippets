/* eslint node/no-deprecated-api: warn */

import { parse } from 'url'
import http from 'http'
import https from 'https'

export function fetch (url, { ...options } = {}) {
  const opts = { ...parse(url), method: 'GET', headers: { 'User-Agent': 'fetch/1.0' }, ...options }
  const transport = opts.protocol === 'https:' ? https : http
  const req = transport.request(opts)

  const self = {}

  self.then = (_resolve) => new Promise((resolve, reject) => {
    req.once('response', res => {
      if (res.statusCode >= 300 && res.statusCode <= 400) {
        console.error(res.statusCode, res.headers.location) // eslint-disable-line
        reject(new Error('redirect not supported'))
        return
      }
      let text = ''
      res.text = async () => text
      res.json = async () => JSON.parse(text)
      res.on('data', (data) => {
        text += data.toString()
      })
      res.on('error', reject)
      res.on('end', () => resolve(res))
    })
    req.on('error', reject)
  }).then(_resolve)

  // non standard
  self.pipe = (stream) => {
    req.once('response', res => res.pipe(stream))
  }

  req.end()
  return self
}
