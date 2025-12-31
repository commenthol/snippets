import { describe, it } from 'mocha'
import assert from 'node:assert'
import { Readable, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { JsonlParseStream } from './jsonlparse.js'

describe('node/streams/JsonlParseStream', () => {
  it('should handle backpressure correctly', async () => {
    const jsonlStream = new JsonlParseStream({
      highWaterMark: 1,
      readableHighWaterMark: 1,
      writeableHighWaterMark: 1,
    })
    const max = 10
    const _lines = new Array(max).fill(0).map((_, i) => `{"index":${i}}\n`)
    _lines.push('{bad json line}\n') // This line should trigger a parse error
    const reader = Readable.from(_lines, { highWaterMark: 1 })
    let cnt = 0

    const slowWriter = new Writable({
      objectMode: true,
      highWaterMark: 2,
      write(_obj, _, cb) {
        // console.debug('Writing object:', _obj)
        cnt++
        setTimeout(() => {
          cb()
        }, 10) // Simulate slow processing
      },
    })

    await pipeline(reader, jsonlStream, slowWriter)
    assert.strictEqual(cnt, max, `all ${max} objects should be processed`)
  })
})
