import { Transform } from 'node:stream'

/**
 * Split Lines Stream
 *
 * This Transform stream reads chunks of data, splits them into lines,
 * and pushes each line downstream. It handles partial lines by buffering
 * them until a complete line is received.
 */
export class SplitLinesStream extends Transform {
  _buffer = ''
  _lines = []

  _doWrite(cb) {
    while (this._lines.length > 0) {
      const line = this._lines.shift().trim()
      if (!this.push(line)) {
        // console.debug('backpressure detected in SplitLinesStream')
        this.once('resume', () => this._doWrite(cb))
        return
      }
    }
    cb()
  }

  _transform(chunk, _encoding, cb) {
    this._buffer += chunk.toString()
    this._lines = this._buffer.split('\n')
    this._buffer = this._lines.pop() // Keep the last partial line in the buffer
    this._doWrite(cb)
  }

  _flush(cb) {
    this._lines.push(this._buffer)
    this._doWrite(cb)
  }
}
