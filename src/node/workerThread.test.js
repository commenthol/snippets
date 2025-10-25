import assert from 'node:assert'
import { getDirname } from './dirname.js'
import { workerThread } from './workerThread.js'

const __dirname = getDirname(import.meta.url)

describe('node/workerThread', function () {
  it('shall count up for 20ms', async function () {
    const filename = `${__dirname}/workerThread.task.js`
    const task = workerThread(filename)
    // console.time('a')
    const result = await task({ ms: 20 })
    // console.timeEnd('a')
    // console.log(result)
    assert.strictEqual(result.done, true)
  })
})
