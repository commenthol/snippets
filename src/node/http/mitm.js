/* eslint-disable no-console */

import fs from 'fs'
import http from 'http'
import https from 'https'
import { parse, fileURLToPath } from 'url' // eslint-disable-line node/no-deprecated-api

export const mitm = (config) => (req, res) => {
  const { url, method, headers } = req
  const { host, protocol } = config
  const _url = protocol + '//' + host + url

  const hostOrigin = headers.host
  headers.host = host

  const handleError = (err) => {
    res.emit('error', err)
  }

  const opts = Object.assign({ method }, parse(_url), { headers })
  const pprotocol = opts.protocol === 'https:' ? https : http

  const preq = pprotocol.request(opts)

  preq.on('response', pres => {
    const { statusCode } = pres
    res.statusCode = statusCode

    // set response headers
    Object.entries(pres.headers).forEach(([key, value]) => {
      if (key === 'location') {
        value = value.replace(host, hostOrigin)
      }
      res.setHeader(key, value)
    })

    console.log({ statusCode, method, url, host, headers: res._headers })

    pres.on('error', handleError)
    pres.pipe(res)
    // alternatively...
    // let data = ''
    // pres.on('data', chunk => { data += chunk })
    // pres.on('finish', () => res.end(data))
  })

  preq.on('error', handleError)
  req.pipe(preq)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const config = {
    host: process.env.HOST || 'www.test.example',
    protocol: 'https:',
    http: {
      port: 8080
    },
    https: {
      port: 8443,
      // restrict ciphers if you like so
      ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA256:!AES256-GCM-SHA384:!AES256-SHA256:!AES256-SHA:!AES128-GCM-SHA256:!AES128-SHA256:!AES128-SHA',
      secureProtocol: 'TLSv1_2_method',
      // create a certificate - https://github.com/commenthol/self-signed-certs
      cert: './star.crt',
      key: './star.key'
    }
  }

  // load the certs as buffer
  config.https.cert = fs.readFileSync(config.https.cert)
  config.https.key = fs.readFileSync(config.https.key)

  // start http and https servers
  http.createServer(config.http, mitm(config)).listen(config.http.port)
  https.createServer(config.https, mitm(config)).listen(config.https.port)
}
