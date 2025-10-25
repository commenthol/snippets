import assert from 'node:assert'
import http from 'node:http'
import request from 'supertest'
import { connect } from './index.js'
import { sleep } from '../../promise/sleep.js'

const start = (req, res, next) => {
  res.body = 0
  next()
}
const stepSync = (err) => (req, res, next) => {
  res.body++
  next(err)
}
const step = (err) => (req, res, next) => {
  setTimeout(() => {
    res.body++
    next(err)
  })
}
const stepAsyncArity3 = (err) => async (req, res, next) => {
  setTimeout(() => {
    res.body++
    next(err)
  })
}
const doThrowSync = (_req, _res, _next) => {
  throw new Error('throwSync')
}
const final = (_req, res, _next) => {
  res.end(String(res.body))
}
const finalErr = (err, _req, res, _next) => {
  res.statusCode = err.status || 500
  res.body += ' ' + err.message
  res.end(String(res.body))
}

describe('node/http/connect', function () {
  it('should connect handlers', function (done) {
    const app = http.createServer(connect(start, stepSync(), stepSync(), final))
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.text, '2')
        done()
      })
  })

  it('should chain connect handlers', function (done) {
    const app = http.createServer(
      connect(start, connect(stepSync(), step()), final)
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.text, '2')
        done()
      })
  })

  it('should connect handlers async', function (done) {
    const app = http.createServer(connect(start, step(), step(), final))
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.text, '2')
        done()
      })
  })

  it('should use next for async for arity == 3', function (done) {
    const app = http.createServer(
      connect(start, stepAsyncArity3(), stepAsyncArity3(), final)
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.text, '2')
        done()
      })
  })

  it('should trap errors', function (done) {
    const app = http.createServer(
      connect(start, stepSync(new Error('first')), stepSync(), final, finalErr)
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.status, 500)
        assert.strictEqual(res.text, '1 first')
        done()
      })
  })

  it('should trap errors async', function (done) {
    const app = http.createServer(
      connect(start, step(new Error('first')), step(), final, finalErr)
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.status, 500)
        assert.strictEqual(res.text, '1 first')
        done()
      })
  })

  it('should trap thrown errors', function (done) {
    const app = http.createServer(
      connect(start, stepSync(), doThrowSync, stepSync(), final, finalErr)
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.status, 500)
        assert.strictEqual(res.text, '1 throwSync')
        done()
      })
  })

  it('supports promise', function (done) {
    const app = http.createServer(
      connect(
        start,
        stepSync(),
        (req, res) => Promise.resolve(res.body++),
        stepSync(),
        final,
        finalErr
      )
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.status, 200)
        assert.strictEqual(res.text, '3')
        done()
      })
  })

  it('supports rejected promise', function (done) {
    const app = http.createServer(
      connect(
        start,
        stepSync(),
        (_req, _res) => Promise.reject(new Error('reject')),
        stepSync(),
        final,
        finalErr
      )
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.status, 500)
        assert.strictEqual(res.text, '1 reject')
        done()
      })
  })

  it('supports next function in async context', function (done) {
    const app = http.createServer(
      connect(
        start,
        stepSync(),
        async (req, res, next) => {
          await sleep(1)
          next()
        },
        stepSync(),
        final,
        finalErr
      )
    )
    request(app)
      .get('/')
      .end((err, res) => {
        assert.strictEqual(err, null)
        assert.strictEqual(res.status, 200)
        done()
      })
  })
})
