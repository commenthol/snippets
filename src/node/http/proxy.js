/**
 * a http proxy which with ssl connect
 */

import { URL, fileURLToPath } from 'url'
import http from 'http'
import net from 'net'

// eslint-disable-next-line no-console
const log = console

/**
 * build proxy
 * @param {number} port
 * @returns {Promise<http.Server>}
 * @example
 * const proxyServer = await buildProxy(8080)
 * console.info(`proxy running on port ${proxyServer.address().port}`)
 **/
export function buildProxy (port = 0) {
  return new Promise((resolve, reject) => {
    const server = proxy(http.createServer())
    server.listen(port, (err) => err ? reject(err) : resolve(server))
  })
}

/**
 * @param {http.Server} server
 * @returns {http.Server}
 */
export function proxy (server) {
  server.on('request', (req, res) => {
    const { method, headers } = req
    const {
      hostname = 'localhost',
      port,
      protocol,
      pathname,
      search
    } = new URL(req.url)

    const options = {
      hostname,
      port: fixPortNumber(port, protocol),
      method,
      path: pathname + search,
      headers
    }

    headers['X-Forwarded-For'] = [req.socket.remoteAddress, headers['X-Forwarded-For']].filter(Boolean).join(', ')

    const proxyReq = http.request(options, (proxyRes) => {
      proxyConn(proxyRes, res)
    })
    const writeErrResponse = (statusCode) => (err) => {
      res.writeHead(statusCode, { 'content-type': 'text/plain' })
      res.write(err.message, 'utf8')
      res.end()
    }

    proxyReq.on('error', writeErrResponse(500))
    proxyReq.on('timeout', writeErrResponse(408))

    proxyConn(req, proxyReq)
  })

  // ssl tunneling
  server.on('connect', (req, socket, head) => {
    let { hostname, port, protocol } = new URL(req.url)

    if (!hostname) {
      [hostname, port] = req.url.split(':')
    }

    // Return SSL-proxy greeting header.
    socket.write('HTTP/' + req.httpVersion + ' 200 Connection established\r\n\r\n')

    // Now forward SSL packets in both directions until done.
    const client = net.connect({
      host: hostname,
      port: fixPortNumber(port, protocol)
    })

    // handle stream from origin
    proxyConn(socket, client)
    // handle stream to target
    proxyConn(client, socket)
  })

  return server
}

function proxyConn (conn, connOut) {
  // data received
  conn.on('data', function (chunk) {
    connOut.write(chunk, 'binary')
  })
  // connection ends
  conn.on('end', () => {
    connOut.end()
  })

  const connExit = (err) => {
    if (err) { log.error(err) }
    connOut.end()
  }

  conn.once('error', connExit)
  conn.once('timeout', connExit)
  conn.once('close', connExit)
}

function fixPortNumber (port, protocol) {
  return port || (protocol === 'https:' ? 443 : 80)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  ;(async () => {
    const { PORT = 8080 } = process.env
    const proxyServer = await buildProxy(PORT)
    log.info(`proxy running on port ${proxyServer.address().port}`)
  })()
}
