import http from 'http'

const timeout = (ms) => new Promise(resolve => setTimeout(() => resolve(), ms))

const wrapPromise = () => {
  let _resolve, _reject
  const promise = new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  return { promise, resolve: _resolve, reject: _reject }
}

/**
 * gracefully shutdown http/ https server
 * @param {http.Server|https.Server} server the server instance
 * @param {object} param1
 * @param {number} [param1.gracefulTimeout=1000] graceful timeout for existing connections
 */
export function shutdownServer (server, { gracefulTimeout = 1000 } = {}) {
  let isShutdown = false

  const serverClose = server.close.bind(server)

  const sockets = new Set()

  function connect (socket) {
    if (isShutdown) {
      socket.destroy()
      return
    }
    sockets.add(socket)
    socket.once('close', function () {
      sockets.delete(socket)
    })
  }

  function setHeaderConnectionClose (res) {
    if (!res.headersSent) {
      res.setHeader('connection', 'close')
    }
  }

  server.on('connection', connect)

  server.on('secureConnection', connect)

  server.close = async function (callback) {
    const p = wrapPromise()
    isShutdown = true

    server.on('request', (req, res) => {
      setHeaderConnectionClose(res)
    })

    for (const socket of sockets) {
      if (!(socket.server instanceof http.Server)) {
        // HTTP CONNECT request socket
        continue
      }

      const res = socket._httpMessage
      if (res) {
        setHeaderConnectionClose(res)
        continue
      }

      socket.destroy()
    }

    if (sockets.size) {
      await timeout(gracefulTimeout)

      for (const socket of sockets) {
        socket.destroy()
      }
    }

    serverClose(err => {
      if (typeof callback === 'function') {
        callback(err)
      }
      if (err) {
        p.reject(err)
      } else {
        p.resolve()
      }
    })

    return p.promise
  }
}
