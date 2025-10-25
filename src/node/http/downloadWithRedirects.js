import fs from 'fs'
import http from 'http'
import https from 'https'
import { Transform } from 'stream'
import zlib from 'zlib'
import { parse } from './parseUrl.js'

class Through extends Transform {
  _transform(chunk, enc, done) {
    this.push(chunk, enc)
    done()
  }
}

/**
 * download url to file - follows redirects
 * @param {String} url
 * @param {String} filename
 * @returns {Promise}
 */
export const download = (url, filename) => {
  const file = fs.createWriteStream(filename)

  const getUrl = (url) => ({
    ...parse(url),
    headers: {
      'User-Agent': 'node/12.0',
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
    },
  })

  return new Promise((resolve, reject) => {
    const handleError = (err) => reject(err)
    file.on('error', handleError)
    file.on('finish', () => resolve(undefined))

    const decompressor = (contentEncoding) => {
      const stream =
        contentEncoding === 'br'
          ? zlib.createBrotliDecompress()
          : contentEncoding === 'gzip'
            ? zlib.createGunzip()
            : contentEncoding === 'deflate'
              ? zlib.createDeflate()
              : new Through()
      stream.on('error', handleError)
      return stream
    }

    const makeReq = (url, depth) => {
      const prot = url.indexOf('https') === 0 ? https : http
      const req = prot.get(getUrl(url), (res) => {
        const code = String(res.statusCode)[0]
        if (depth && code === '3') {
          makeReq(res.headers.location, --depth)
          return
        }
        if (code === '2') {
          const contentEncoding = res.headers['content-encoding']
          res.pipe(decompressor(contentEncoding)).pipe(file)
          res.on('error', handleError)
        } else {
          reject(new Error(String(res.statusCode)))
        }
      })
      req.on('error', handleError)
      req.end()
    }

    makeReq(url, 7)
  })
}
