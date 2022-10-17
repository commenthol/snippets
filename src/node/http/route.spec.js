import http from 'http'
import assert from 'assert'
import request from 'supertest'
import connect from './connect.js'
import { route } from './route.js'

const final = (req, res) => {
  res.end(res.body)
}

const finalError = (err, req, res, next) => {
  console.log(err)
  res.statusCode = 500
  res.end()
}

const set = (name) => (req, res, next) => {
  res.body = res.body || ''
  res.body += `${req.method} ${name} `
  next()
}

describe('node/http/route', function () {
  let app
  before(function () {
    const c = connect(
      route()
        .get(set(1), set(2))
        .post(set(3))
        .put(set(4)),
      final, finalError
    )
    app = http.createServer(c)
  })

  it('shall route GET', function () {
    return request(app)
      .get('/')
      .expect(200, 'GET 1 GET 2 ')
  })

  it('shall route POST', function () {
    return request(app)
      .post('/')
      .expect(200, 'POST 3 ')
  })

  it('shall route PUT', function () {
    return request(app)
      .put('/')
      .expect(200, 'PUT 4 ')
  })

  it('shall ignore DELETE', function () {
    return request(app)
      .delete('/')
      .expect(200, '')
  })

  it('shall throw if method was already declared', function () {
    assert.throws(() => {
      route()
        .get(set(1), set(2))
        .post(set(3))
        .put(set(4))
        .get(set(5))
    }, /Method 'GET' is already defined/)
  })
})
