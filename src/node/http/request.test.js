import assert from 'node:assert'
import http from 'http'
import { Writable } from 'stream'
import { request } from './request.js'

describe('node/http/request', function () {
  this.timeout(2000)
  let server

  const port = 30003
  const host = `http://localhost:${port}`

  before((done) => {
    server = http.createServer((req, res) => {
      const { method, url = '' } = req
      // console.log(method, url)
      if (url === '/head') {
        if (method !== 'HEAD') {
          res.statusCode = 500
        }
        res.end()
      } else if (url === '/godot') {
        // never turn back
      } else if (url === '/redirect') {
        res.setHeader('location', '../../redirect1?foo=bar#hash')
        res.statusCode = 302
        res.end()
      } else if (url.indexOf('/redirect1') === 0) {
        res.setHeader('location', '/')
        res.statusCode = 302
        res.end()
      } else {
        res.end('<!DOCTYPE html>\n<html><body>works</body></html>')
      }
    })
    server.listen(port, done)
  })

  after(() => {
    server.close()
  })

  const headers = { 'User-Agent': 'request/1.0' }

  it('shall request and follow redirects', function (done) {
    request(host + '/redirect')
      .set(headers)
      .end((err, res) => {
        // err && console.log(err)
        // res && console.log(res.text, res.headers, res.redirects)
        assert.ok(!err, err && err.message)
        assert.ok(/DOCTYPE html/.test(res.text))
        assert.deepStrictEqual(res.redirects, [
          host + '/redirect1?foo=bar#hash',
          host + '/',
        ])
        done()
      })
  })

  it('shall use HEAD request', async function () {
    const res = await request(host + '/head')
      .set(headers)
      .head()
      .end()
    assert.strictEqual(res.statusCode, 200)
  })

  it('shall return a promise', function () {
    return request(host).then((res) => {
      // res && console.log(res.text, res.headers, res.redirects)
      assert.ok(/DOCTYPE html/.test(res.text))
      assert.deepStrictEqual(res.redirects, undefined)
    })
  })

  it('shall stream', function (done) {
    let text = ''
    const write = (chunk, enc, done) => {
      text += chunk
      done()
    }
    const writer = new Writable({ write })
    writer.on('finish', () => {
      assert.ok(/DOCTYPE html/.test(text))
      done()
    })
    writer.on('response', (res) => {
      assert.deepStrictEqual(res.redirects, [
        host + '/redirect1?foo=bar#hash',
        host + '/',
      ])
    })
    writer.on('error', (err) => {
      assert.ok(false, err) // never reach here
    })
    request(host + '/redirect').pipe(writer)
  })

  describe('timeout', function () {
    it('shall return a timeout error', function () {
      return request(host + '/godot')
        .timeout(1000)
        .then(() => {
          assert.ok(true, 'shall never reach here')
        })
        .catch((err) => {
          assert.strictEqual(err.message, 'err_timeout')
        })
    })

    it('shall return a timeout error if streaming', function (done) {
      const write = (chunk, enc, done) => {
        done()
      }
      const writer = new Writable({ write })
      writer.on('error', (err) => {
        assert.strictEqual(err.message, 'err_timeout')
        done()
      })

      request(host + '/godot')
        .timeout(1000)
        .pipe(writer)
    })
  })
})
