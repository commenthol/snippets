// const http = require('http')
// const https = require('https')
// const { parse } = require('url') // eslint-disable-line node/no-deprecated-api
import http from 'http'
import https from 'https'
import { parse, format, resolve } from 'url' // eslint-disable-line node/no-deprecated-api

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
  if (typeof method === 'object') {
    opts = method
    method = 'GET'
  }
  method = method.toUpperCase()
  opts = Object.assign({ method, redirects: 7, timeout: 30000 }, parse(url), opts)
  const locations = []

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

  const end = (cb) => {
    const protocol = opts.protocol === 'https:' ? https : http
    const req = protocol.request(opts)

    const handleError = (err) => {
      clearTimeout(timer)
      cb(err)
    }
    const timer = opts.timeout && setTimeout(() => {
      req.destroy(new Error('err_timeout'))
    }, opts.timeout)

    req.on('response', res => {
      // @ts-ignore
      res.text = ''
      const { location } = res.headers
      clearTimeout(timer)
      if ([301, 302].indexOf(res.statusCode) !== -1 && location && locations.length < opts.redirects) {
        opts = redirect(opts, location)
        locations.push(opts.href)
        end(cb)
      } else {
        // @ts-ignore
        if (locations.length) res.locations = locations
        res.on('error', handleError)
        // @ts-ignore
        res.on('data', chunk => { res.text += chunk })
        res.on('end', () => cb(null, res))
      }
    })
    req.on('error', handleError)
    req.end(_data)
  }

  const pipe = (stream) => {
    const protocol = opts.protocol === 'https:' ? https : http
    const req = protocol.request(opts)

    const handleError = (err) => {
      clearTimeout(timer)
      stream.emit('error', err)
    }
    const timer = opts.timeout && setTimeout(() => {
      req.destroy(new Error('err_timeout'))
    }, opts.timeout)

    req.on('response', res => {
      const { location } = res.headers
      clearTimeout(timer)
      if ([301, 302].indexOf(res.statusCode) !== -1 && location && locations.length < opts.redirects) {
        opts = redirect(opts, location)
        locations.push(opts.href)
        pipe(stream)
      } else {
        // @ts-ignore
        if (locations.length) res.locations = locations
        stream.emit('response', res)
        res.pipe(stream)
        res.on('error', handleError)
      }
    })
    req.on('error', handleError)
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
