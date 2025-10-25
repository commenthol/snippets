import assert from 'node:assert'
import http from 'http'
import request from 'supertest'
import sinon from 'sinon'
import { getXForwardedForIp, rateLimit, connect } from './index.js'

const echo = (req, res) => {
  const body = res.body || { headers: req.headers }
  res.end(JSON.stringify(body))
}
const final = (err, req, res, _next) => {
  res.statusCode = err.status || 500
  req.body = { error: err.message }
  echo(req, res)
}

describe('node/http/rateLimit', function () {
  describe('getXForwardedForIp', function () {
    it('should obtain client-ip', function () {
      const req = { headers: { 'x-forwarded-for': '1.2.3.4, 127.0.0.1' } }
      const result = getXForwardedForIp(req)
      assert.strictEqual(result, '1.2.3.4')
    })

    it('should obtain client-ip ipv6', function () {
      const req = {
        headers: { 'x-forwarded-for': '2607:f0d0:1002:51::4, 127.0.0.1' },
      }
      const result = getXForwardedForIp(req)
      assert.strictEqual(result, '2607:f0d0:1002:51::4')
    })

    it('should reject if not ip', function () {
      const req = {
        headers: { 'x-forwarded-for': 'foobar, 1.2.3.4, 127.0.0.1' },
      }
      const result = getXForwardedForIp(req)
      assert.strictEqual(result, undefined)
    })
  })

  describe('rateLimit', function () {
    let clock
    before(function () {
      clock = sinon.useFakeTimers({ shouldAdvanceTime: true, now: 100 })
    })
    after(function () {
      clock.restore()
    })

    it('should rate-limit', async function () {
      const max = 2
      const app = http.createServer(
        connect(rateLimit({ headers: true, max, timeoutSec: 60 }), echo, final)
      )
      const headers = { 'X-Forwarded-For': '1.2.3.4, 127.0.0.1' }

      /**
       *
       * @param {{status?:number, remain:number, retryAfter?:string}} param0
       * @returns
       */
      const rtest = ({ status = 200, remain, retryAfter }) =>
        request(app)
          .get('/')
          .set(headers)
          .expect(status)
          .then(({ headers }) => {
            assert.strictEqual(headers['ratelimit-limit'], '2')
            assert.strictEqual(headers['ratelimit-remaining'], '' + remain)
            assert.strictEqual(typeof headers['ratelimit-reset'], 'string')
            if (retryAfter) {
              assert.strictEqual(headers['retry-after'], retryAfter)
            }
          })

      for (let i = 1; i > -1; i -= 1) {
        await rtest({ status: 200, remain: i })
      }
      await rtest({
        status: 429,
        remain: 0,
        retryAfter: 'Thu, 01 Jan 1970 00:01:00 GMT',
      })

      clock.tick(60000)

      for (let i = 1; i > -1; i -= 1) {
        await rtest({ status: 200, remain: i })
      }
      await rtest({
        status: 429,
        remain: 0,
        retryAfter: 'Thu, 01 Jan 1970 00:02:00 GMT',
      })
    })
  })
})
