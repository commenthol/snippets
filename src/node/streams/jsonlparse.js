import { Transform } from 'node:stream'

/**
 * JSONL (JSON Lines) Parse Stream
 *
 * This Transform stream reads chunks of data, splits them into lines,
 * parses each line as a JSON object, and pushes the objects downstream.
 * It handles partial lines by buffering them until a complete line is received.
 */
export class JsonlParseStream extends Transform {
  _buffer = ''
  _lines = []

  constructor(options = {}) {
    super({ ...options, readableObjectMode: true })
  }

  _doWrite(cb) {
    while (this._lines.length > 0) {
      const line = this._lines.shift().trim()
      if (!line) continue
      try {
        const obj = JSON.parse(line)
        if (!this.push(obj)) {
          // console.debug('backpressure detected in JsonlParseStream')
          this.once('resume', () => this._doWrite(cb))
          return
        }
      } catch (/** @type {any} */ _err) {
        console.error(`Failed to parse JSONL line: ${line}`)
      }
    }
    cb()
  }

  _transform(chunk, _encoding, cb) {
    // console.debug('Received chunk:', chunk.toString())
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
