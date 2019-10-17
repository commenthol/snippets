const assert = require('assert')
const { Writable } = require('stream')
const request = require('../../../src/node/http/request')

describe('node/http/request', function () {
  this.timeout(4000)

  it('shall request and follow redirects', function (done) {
    request('http://duck.com')
      .end((err, res) => {
        // err && console.log(err)
        // res && console.log(res.text, res.headers, res.locations)
        assert.ok(!err, err && err.message)
        assert.ok(/DOCTYPE html/.test(res.text))
        assert.deepStrictEqual(res.locations, ['https://duck.com', 'https://duckduckgo.com'])
        done()
      })
  })

  it('shall return a promise', function () {
    return request('https://duckduckgo.com')
      .then((res) => {
        // res && console.log(res.text, res.headers, res.locations)
        assert.ok(/DOCTYPE html/.test(res.text))
        assert.deepStrictEqual(res.locations, undefined)
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
      assert.deepStrictEqual(res.locations, ['https://duckduckgo.com'])
    })
    writer.on('error', (err) => {
      assert.ok(false, err) // never reach here
    })
    request('https://duck.com')
      .pipe(writer)
  })
})
