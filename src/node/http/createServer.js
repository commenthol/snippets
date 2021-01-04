// @see https://github.com/nodejs/node-v0.x-archive/issues/9066#issuecomment-124210576

import http from 'http'
import EventEmitter from 'events'

export function createServer (app) {
  const state = new EventEmitter()
  state.shutdown = false

  const server = http.createServer(app)

  server.shutdown = function () {
    server.close()
    state.shutdown = true
    state.emit('shutdown')
  }
  server.on('connection', function (socket) {
    function destroy () {
      if (socket.HAS_OPEN_REQUESTS === 0) socket.destroy()
    }
    socket.HAS_OPEN_REQUESTS = 0
    state.once('shutdown', destroy)
    socket.once('close', function () {
      state.removeListener('shutdown', destroy)
    })
  })
  server.on('request', function (req, res) {
    const socket = req.connection
    socket.HAS_OPEN_REQUESTS++
    res.on('finish', function () {
      socket.HAS_OPEN_REQUESTS--
      if (state.shutdown && socket.HAS_OPEN_REQUESTS === 0) {
        socket.destroy()
      }
    })
  })

  return server
}
