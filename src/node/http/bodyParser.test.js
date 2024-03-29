import assert from 'assert'
import http from 'http'
import request from 'supertest'
import { bodyParser, connect } from './index.js'
import { nodeVersion } from '../index.js'

const echo = (req, res) => {
  if (typeof req.body === 'object') {
    res.setHeader('Content-Type', 'application/json')
    res.body = JSON.stringify(req.body)
  } else {
    res.body = req.body
  }
  res.end(res.body)
}
const final = (err, req, res, next) => {
  res.statusCode = err.status || 500
  req.body = { error: err.message }
  echo(req, res)
}

describe('node/http/bodyParser', function () {
  it('should parse text', function (done) {
    const app = http.createServer(connect(bodyParser(), echo, final))
    request(app).post('/').send('test=12345').end((err, res) => {
      assert(!err)
      assert.strictEqual(res.text, '{"test":12345}')
      done()
    })
  })

  it('should limit upload with 413', function (done) {
    const app = http.createServer(connect(bodyParser({ limit: 100 }), echo, final))
    request(app).post('/').send('test=' + Array(1000).fill('x').join('')).end((err, res) => {
      assert(!err)
      assert.strictEqual(res.status, 413)
      done()
    })
  })

  it('should limit upload with 400 if content-length is wrong', function (done) {
    const text = new Array(1000).fill('x').join('')
    const app = http.createServer(connect(bodyParser({ limit: 100 }), echo, final))
    request(app).post('/')
      .send(text)
      .set('Content-Length', 10)
      .end((err, res) => {
        assert(!err)
        assert.strictEqual(res.status, nodeVersion[0] >= 16 ? 200 : 400) // issue fixed with node@16
        done()
      })
  })

  it('should parse json', function (done) {
    const payload = { test: 123 }
    const app = http.createServer(connect(bodyParser(), echo, final))
    request(app).post('/').set('Content-Type', 'application/json').send(payload).end((err, res) => {
      assert(!err)
      assert.deepStrictEqual(res.body, payload)
      done()
    })
  })

  it('should fail with 400 on json parse', function (done) {
    const payload = 'test: 123'
    const app = http.createServer(connect(bodyParser(), echo, final))
    request(app).post('/').set('Content-Type', 'application/json').send(payload).end((err, res) => {
      assert(!err)
      assert(res.status === 400)
      assert(res.body.error === 'err_json_parse', res.body)
      done()
    })
  })

  it('should parse urlencoded', function (done) {
    const payload = { test: 123, foo: 'bar', umlaut: 'üäö' }
    const app = http.createServer(connect(bodyParser(), echo, final))
    request(app).post('/').type('form').send(payload).end((err, res) => {
      assert(!err)
      assert.deepStrictEqual(res.body, payload)
      done()
    })
  })
})
