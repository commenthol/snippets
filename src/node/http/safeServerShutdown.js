import http from 'node:http'

/** @typedef {import('node:https').Server} HttpsServer */

const EXIT_EVENTS = ['beforeExit', 'SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK']

/**
 * gracefully shutdown http/ https server
 * alternative to [stoppable](https://github.com/hunterloftis/stoppable).
 * @param {http.Server|HttpsServer} server the server instance
 * @param {object} [param1]
 * @param {number} [param1.gracefulTimeout=1000] graceful timeout for existing connections
 * @param {{info: function, error: function}} [param1.log] logger
 */
export function safeServerShutdown(
  server,
  { gracefulTimeout = 1000, log } = {}
) {
  let isShutdown = false

  const serverClose = server.close.bind(server)

  const sockets = new Set()

  function connect(socket) {
    if (isShutdown) {
      destroy([socket])
      return
    }
    sockets.add(socket)
    socket.once('close', function () {
      sockets.delete(socket)
    })
  }

  function setHeaderConnectionClose(res) {
    if (!res.headersSent) {
      res.setHeader('connection', 'close')
    }
  }

  server.on('connection', connect)

  server.on('secureConnection', connect)

  // @ts-expect-error
  server.close = async function (callback) {
    const p = Promise.withResolvers()
    isShutdown = true
    log?.info('server is shutting down')

    server.on('request', (_req, res) => {
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
    }

    if (sockets.size) {
      await sleep(gracefulTimeout)
      destroy(sockets)
    }

    serverClose((err) => {
      err
        ? log?.error(`server shutdown with failures ${err.message}`)
        : log?.info('server shutdown successful')
      if (typeof callback === 'function') {
        callback(err)
      }
      if (err) {
        p.reject(err)
      } else {
        p.resolve(undefined)
      }
    })

    return p.promise
  }

  EXIT_EVENTS.forEach((ev) =>
    process.on(ev, () => {
      if (isShutdown) return
      // @ts-ignore
      server.close().catch(() => {})
    })
  )
}

const sleep = (ms = 100) =>
  new Promise((resolve) => setTimeout(() => resolve(ms), ms))

function destroy(sockets) {
  for (const socket of sockets) {
    socket.end()
  }
  setImmediate(() => {
    for (const socket of sockets) {
      socket.destroy()
    }
  })
}
