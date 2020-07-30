import assert from 'assert'
import http from 'http'
import { connect, timeoutBreaker } from '.'
import request from 'supertest'

describe('node/http/timeoutBreaker', function () {
  it('should parse text', function (done) {
    const app = http.createServer(connect(timeoutBreaker(20)))
    request(app).get('/').accept('json').end((err, res) => {
      assert(!err)
      assert.strictEqual(res.statusCode, 500)
      assert.deepStrictEqual(res.body, { error: 'Request took too long to process' })
      done()
    })
  })
})
