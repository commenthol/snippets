import assert from 'node:assert'
import { Worker } from 'node:worker_threads'
import { ThreadServer } from './ThreadConnection.js'
import { Store } from './Store.js'

const file = new URL('threadClient.js', import.meta.url)

describe('node/ipc/ThreadServer', function () {
  it('shall communicate with worker threads', function (done) {
    const store = new Store()
    const worker = new Worker(file)
    const server = new ThreadServer(worker, store)
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
