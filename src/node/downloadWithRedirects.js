/* eslint node/no-deprecated-api: warn */

import fs from 'fs'
import http from 'http'
import https from 'https'
import { parse } from 'url'

/**
 * download url to file - follows redirects
 * @param {String} url
 * @param {Path} filename
 * @returns {Promise}
 */
export const download = (url, filename) => {
  const file = fs.createWriteStream(filename)

  const getUrl = (url) => ({
    ...parse(url),
    headers: {
      'User-Agent': 'Mozilla/5.0',
      Accept: '*/*'
    }
  })

  return new Promise((resolve, reject) => {
    const error = (err) => reject(err)
    file.on('error', error)
    file.on('finish', () => resolve())

    function makeReq (url, depth) {
      const prot = url.indexOf('https') === 0 ? https : http
      const req = prot.get(getUrl(url), res => {
        const code = String(res.statusCode)[0]
        if (depth && code === '3') {
          makeReq(res.headers.location, --depth)
          return
        }
        if (code === '2') {
          res.pipe(file).on('error', error)
          res.on('error', error)
        } else {
          reject(new Error(res.statusCode))
        }
      })
      req.on('error', error)
      req.end()
    }

    makeReq(url, 5)
  })
}
