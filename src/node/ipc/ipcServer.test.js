import assert from 'node:assert'
import child from 'node:child_process'
import { IpcServer } from './IpcConnection.js'
import { Store } from './Store.js'

describe('node/ipc/IpcServer', function (done) {
  it('shall communicate with child process', function (done) {
    const file = new URL('ipcClient.js', import.meta.url)

    const store = new Store()
    const subprocess = child.fork(file, { detached: false })
    const server = new IpcServer(subprocess, store)
    server.on('command', async (method) => {
      console.log(method)
      assert.strictEqual(await store.get('foo'), 42)
      done()
    })
    server.on('error', err => {
      console.error(err)
    })
  })
})
