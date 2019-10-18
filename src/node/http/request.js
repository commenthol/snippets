// const http = require('http')
// const https = require('https')
// const { parse } = require('url') // eslint-disable-line node/no-deprecated-api
import http from 'http'
import https from 'https'
import { parse } from 'url' // eslint-disable-line node/no-deprecated-api

/**
 * http(s) request with redirects
 *
 * @example
 * request('https://duck.com').then(res => { ... })
 * request('https://duck.com').end((err, res) => { ... })
 * request('https://duck.com').pipe(fs.createWriteStream(...))
 */
export function request (url, method = 'GET', opts) {
  let _data = ''
  method = method.toUpperCase()
  opts = Object.assign({ method, redirects: 7 }, parse(url), opts)
  const locations = []

  const end = (cb) => {
    const protocol = opts.protocol === 'https:' ? https : http
    const req = protocol.request(opts)
    req.on('response', res => {
      res.text = ''
      const { location } = res.headers
      if ([301, 302].indexOf(res.statusCode) !== -1 && location && locations.length < opts.redirects) {
        opts = Object.assign(opts, parse(location))
        locations.push(location)
        end(cb)
      } else {
        if (locations.length) res.locations = locations
        res.on('error', cb)
        res.on('data', chunk => { res.text += chunk })
        res.on('end', () => cb(null, res))
      }
    })
    req.on('error', cb)
    req.end(_data)
  }

  const pipe = (stream) => {
    const protocol = opts.protocol === 'https:' ? https : http
    const req = protocol.request(opts)
    const error = (err) => {
      stream.emit('error', err)
    }

    req.on('response', res => {
      res.text = ''
      const { location } = res.headers
      if ([301, 302].indexOf(res.statusCode) !== -1 && location && locations.length < opts.redirects) {
        opts = Object.assign(opts, parse(location))
        locations.push(location)
        pipe(stream)
      } else {
        if (locations.length) res.locations = locations
        stream.emit('response', res)
        res.pipe(stream)
        res.on('error', error)
      }
    })
    req.on('error', error)
    req.end(_data)
  }

  const self = {
    set: (headers) => {
      opts.headers = Object.assign({}, opts.headers, headers)
      return self
    },
    send: (data) => {
      if (opts.method === 'GET') opts.method = 'POST'
      _data += data
      return self
    },
    auth: (username, password) => {
      if (/:/.test(username)) throw new TypeError('username contains colons')
      const base64 = Buffer.from(`${username}:${password}`).toString('base64')
      const authorization = `Basic ${base64}`
      self.set({ Authorization: authorization })
      return self
    },
    redirects: (redirects = 7) => {
      opts.redirects = redirects
      return self
    },
    pipe: (stream) => pipe(stream),
    end: (cb) => end(cb),
    then: async (_resolve, _reject) => {
      return new Promise((resolve, reject) => {
        end((err, res) => {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        })
      }).then(_resolve, _reject)
    },
    catch: async (errFn) => {
      return self
        .then(res => res)
        .catch(errFn)
    }
  }

  http.METHODS.forEach(method => {
    self[method.toLowerCase()] = (url) => {
      opts = Object.assign(opts, { method, redirects: 7 }, url ? parse(url) : {})
      return self
    }
  })

  return self
}

// module.exports = request
export default request
