// const http = require('http')
// const https = require('https')
// const { parse, format, resolve } = require('url') // eslint-disable-line n/no-deprecated-api
import { Writable } from 'stream'
import http from 'http'
import https from 'https'
import { parse, format, resolve } from 'url' // eslint-disable-line n/no-deprecated-api
import { unzip } from './unzip.js'

/**
 * http(s) request with redirects
 *
 * @example
 * request('https://duck.com').end((err, res) => { ... })
 * request('https://duck.com').pipe(fs.createWriteStream(...))
 * request('https://duck.com', {
 *   headers: {
 *     'Accept-Encoding': 'gzip, deflate, br',
 *     'User-Agent': 'request/1.0'
 *   }
 * }).then(({ headers, statusCode, text, redirects }) => {
 *   console.log({ headers, statusCode, text, redirects })
 * })
 */
export function request (url, method = 'GET', opts) {
  let _data = ''

  if (typeof url === 'object') {
    opts = url
    method = 'GET'
    url = ''
  }
  if (typeof method === 'object') {
    opts = method
    method = 'GET'
  }

  method = method.toUpperCase()
  opts = Object.assign({ method, redirects: 7, timeout: 30000 }, parse(url), opts)
  const redirects = []

  const redirect = (opts, location) => {
    const loc = parse(location)
    const { protocol, host, hostname, port, pathname } = opts

    Object.assign(opts, loc)

    if (!loc.hostname) {
      Object.assign(opts, { protocol, host, hostname, port })
      if (loc.pathname[0] === '.') {
        opts.pathname = resolve(pathname, loc.pathname)
        opts.path = opts.pathname + (loc.search || '')
      }
      opts.href = format(opts)
    }

    return opts
  }

  const pipe = (stream) => {
    const transport = opts.protocol === 'https:' ? https : http
    const req = transport.request(opts)

    const handleError = (err) => {
      clearTimeout(timer)
      stream.emit('error', err)
    }
    const timer = opts.timeout && setTimeout(() => {
      req.destroy(new Error('err_timeout'))
    }, opts.timeout)

    req.once('response', res => {
      const { location } = res.headers
      clearTimeout(timer)
      if ([301, 302].indexOf(res.statusCode) !== -1 && location && redirects.length < opts.redirects) {
        opts = redirect(opts, location)
        redirects.push(opts.href)
        pipe(stream)
      } else {
        if (redirects.length) res.redirects = redirects
        res.on('error', handleError)
        stream.emit('response', res)
        // res.pipe(stream)
        res.pipe(unzip(res.headers['content-encoding'])).pipe(stream)
      }
    })
    req.on('error', handleError)
    req.end(_data)
  }

  const end = (cb) => {
    let res = null

    const writer = new Writable({
      write (chunk, encoding, callback) {
        res.text += chunk
        callback()
      }
    })

    writer.on('response', _res => {
      res = _res
      res.text = ''
    })
    writer.on('error', (err) => cb(err, res))
    writer.on('finish', () => cb(null, res))

    pipe(writer)
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
    timeout: (timeout) => {
      opts.timeout = timeout
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
    end: (cb) => {
      if (!cb) {
        return new Promise((resolve, reject) => {
          end((err, res) => {
            if (err) {
              reject(err)
            } else {
              resolve(res)
            }
          })
        })
      } else {
        end(cb)
      }
    },
    then: async (resolveFn, rejectFn) => self.end().then(resolveFn, rejectFn),
    catch: async (errFn) => self.then(res => res).catch(errFn)
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

/*
request('https://duck.com', {
  headers: {
    'Accept-Encoding': 'gzip, deflate, br',
    'User-Agent': 'request/1.0'
  }
}).then(({ headers, statusCode, text, redirects }) => {
  console.log({ headers, statusCode, text, redirects })
})
*/
