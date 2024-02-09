import assert from 'assert'
import { redirect2Https } from './redirect2Https.js'

const mock = ({
  headers = { host: 'localhost' },
  url = '/'
}) => {
  const req = { headers, url }
  const res = {
    _headers: {},
    setHeader: (key, val) => {
      res._headers[key] = val
    },
    end: () => {}
  }
  return {
    req,
    res
  }
}

describe('node/http/redirect2Https', function () {
  it('shall pass https traffic', function (done) {
    const { req, res } = mock({})
    req.protocol = 'https'
    redirect2Https()(req, res, () => {
      done()
    })
  })

  it('shall pass https traffic if x-forwared-proto is set', function (done) {
    const { req, res } = mock({ headers: { host: 'localhost', 'x-forwarded-proto': 'https' } })
    req.protocol = 'http'
    redirect2Https()(req, res, () => {
      done()
    })
  })

  it('shall redirect to https', function () {
    const { req, res } = mock({})
    redirect2Https()(req, res)
    assert.strictEqual(res._headers.Location, 'https://localhost')
    assert.strictEqual(res.statusCode, 302)
  })

  it('shall redirect to host and url', function () {
    const { req, res } = mock({ headers: { host: 'example.com' }, url: '/test' })
    redirect2Https()(req, res)
    assert.strictEqual(res._headers.Location, 'https://example.com/test')
    assert.strictEqual(res.statusCode, 302)
  })

  it('shall always redirect to a defined url', function () {
    const { req, res } = mock({ headers: { host: 'example.com' }, url: '/test' })
    redirect2Https('https://foo.bar')(req, res)
    assert.strictEqual(res._headers.Location, 'https://foo.bar')
    assert.strictEqual(res.statusCode, 302)
  })

  it('shall always redirect to a defined url with 301', function () {
    const { req, res } = mock({ headers: { host: 'example.com' }, url: '/test' })
    redirect2Https('https://foo.bar', 301)(req, res)
    assert.strictEqual(res._headers.Location, 'https://foo.bar')
    assert.strictEqual(res.statusCode, 301)
  })

  it('shall throw if redirect is set to http', function () {
    assert.throws(() => {
      const { req, res } = mock({})
      redirect2Https('http://foo.bar', 301)(req, res)
    }, /^Error: redirectUrl needs to use https:\/\/ as protocol/)
  })
})
