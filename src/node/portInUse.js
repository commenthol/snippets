import net from 'node:net'

export const portInUse = (port, host = '127.0.0.1') =>
  new Promise((resolve) => {
    const server = net.createServer(socket => {
      socket.write('ping')
      socket.pipe(socket)
    })
    server.on('error', () => {
      resolve(true)
    })
    server.on('listening', () => {
      server.close()
      resolve(false)
    })
    server.listen(port, host)
  })
