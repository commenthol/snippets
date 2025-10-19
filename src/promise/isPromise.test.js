import assert from 'assert'
import { isPromise } from './index.js'

describe('promise/isPromise', () => {
  it('Promise', () => {
    const p = new Promise(() => {})
    assert.equal(isPromise(p), true)
  })
  it('Promise.resolve()', () => {
    const p = Promise.resolve()
    assert.equal(isPromise(p), true)
  })
  it('async function', () => {
    const p = async () => {}
    assert.equal(isPromise(p), true)
  })
  it('object with .then()', () => {
    class PromiseLike {
      then() {}
    }
    const p = new PromiseLike()
    assert.equal(isPromise(p), true)
  })
})
