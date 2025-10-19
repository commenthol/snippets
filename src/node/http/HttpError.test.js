import assert from 'assert'
import { HttpError } from './HttpError.js'

// const log = console.log
const log = () => {}

const assertLine = (err, line) => {
  const e = new Error('')
  const occurred = e.stack.split(/\n/)[2]
  const [_, l] = /^.*:(\d+):\d+[)]\s*$/.exec(occurred) || [undefined, 0]
  const regex = new RegExp(`HttpError\.test\.js:${+line + +l}`)
  const first = err.stack.split(/\n/)[1]
  assert.ok(regex.test(first), `${regex.source} !== ${first}`)
}

describe('node/http/HttpError', function () {
  it('shall set message if status code is missing', function () {
    const err = new HttpError('test')
    log(err)
    assert.strictEqual(err.message, 'test')
    assert.strictEqual(err.status, 500)
  })

  it('shall set status 500', function () {
    const err = new HttpError()
    log(err)
    assert.strictEqual(err.message, 'Internal Server Error')
    assert.strictEqual(err.status, 500)
  })

  it('shall set status 401', function () {
    const err = new HttpError(401)
    log(err)
    assert.strictEqual(err.message, 'Unauthorized')
    assert.strictEqual(err.status, 401)
  })

  it('shall set custom status 600', function () {
    const err = new HttpError(600)
    log(err)
    assert.strictEqual(err.message, '600')
    assert.strictEqual(err.status, 600)
  })

  it('shall set custom message', function () {
    const err = new HttpError(403, 'Nanana')
    log(err)
    assertLine(err, -2)
    assert.strictEqual(err.message, 'Nanana')
    assert.strictEqual(err.status, 403)
    assert.strictEqual(err.originalMessage, undefined)
  })

  it('shall forward existing error', function () {
    const error = new TypeError('previous error')
    const err = new HttpError(403, '', error)
    log(err)
    assertLine(err, -2)
    assert.strictEqual(err.message, 'Forbidden')
    assert.strictEqual(err.status, 403)
    assert.strictEqual(err.name, 'HttpError')
    assert.strictEqual(err.cause.message, 'previous error')
    assert.strictEqual(err.stack.split(/\n/)[0], 'HttpError: Forbidden')
  })

  it('shall forward existing error with custom message', function () {
    const error = new TypeError('previous error')
    const err = new HttpError(403, 'Nanana', error)
    log(err)
    assertLine(err, -2)
    assert.strictEqual(err.message, 'Nanana')
    assert.strictEqual(err.status, 403)
    assert.strictEqual(err.name, 'HttpError')
    assert.strictEqual(err.stack.split(/\n/)[0], 'HttpError: Nanana')
  })
})
