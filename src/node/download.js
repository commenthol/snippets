import fs from 'fs'
import http from 'http'
import https from 'https'

/**
 * download url to file - does not follow redirects
 * @param {String} url
 * @param {Path} filename
 */
export const download = (url, filename) => {
  const file = fs.createWriteStream(filename)
  const mod = url.indexOf('https') === 0 ? https : http

  return new Promise((resolve, reject) => {
    const error = (err) => reject(err)
    file.on('error', error)
    file.on('finish', () => resolve())
    const req = mod.get(url, res => {
      res.pipe(file).on('error', error)
      res.on('error', error)
    })
    req.on('error', error)
    req.end()
  })
}
