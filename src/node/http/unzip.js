import zlib from 'zlib'
import { Transform } from 'stream'

class Through extends Transform {
  constructor(options) {
    super(options)
    this.on('pipe', (src) => {
      src.on('error', (err) => {
        this.emit('error', err)
      })
    })
  }

  _transform(data, encoding, callback) {
    this.push(data)
    callback()
  }
}

// get contentEncoding header
export const contentEncoding = (res) => res.headers['content-encoding']

/**
 * unzip stream - supports brotli, gzip, deflate
 */
export const unzip = (contentEncoding) => {
  const stream = new Through()

  const unzipStream =
    contentEncoding === 'br'
      ? zlib.createBrotliDecompress()
      : contentEncoding === 'gzip'
        ? zlib.createUnzip()
        : contentEncoding === 'deflate'
          ? zlib.createInflate()
          : new Through()

  stream.on('pipe', function (src) {
    src.pipe(unzipStream)
  })
  stream.on('error', function (err) {
    unzipStream.emit('error', err)
  })

  stream.pipe = function pipe(dest) {
    unzipStream.on('error', (err) => {
      // @ts-expect-error
      if (err && err.code === 'Z_BUF_ERROR') {
        // unexpected end of file is ignored by browsers and curl
        dest.emit('end')
        return
      }
      dest.emit('error', err)
    })

    return unzipStream.pipe(dest)
  }

  return stream
}
