import assert from 'assert'
import {promisify} from '../../src/promise'

describe('promise/promisify', () => {
  const timeout = (ms, cb) => setTimeout(() => { cb() }, ms)
  const promise = promisify(timeout)

  it('is of type Promise', () => {
    assert.ok(promise(() => {}) instanceof Promise)
  })
  it('should run asynchronously', () => {
    return promise(10).then(() => 1)
      .then((res) => assert.equal(res, 1))
  })
})
