import { describe, it } from 'mocha'
import assert from 'node:assert'
import { Readable, Writable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { SplitLinesStream } from './splitLines.js'

describe('node/streams/SplitLinesStream', () => {
  it('should handle backpressure correctly', async () => {
    const jsonlStream = new SplitLinesStream({
      highWaterMark: 1,
    })
    const max = 10
    const _lines = new Array(max).fill(0).map((_, i) => `{"index":${i}}\n`)
    const reader = Readable.from(_lines, { highWaterMark: 1 })
    let cnt = 0

    const slowWriter = new Writable({
      highWaterMark: 2,
      write(_line, _, cb) {
        // console.debug('Writing line:', _line)
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
