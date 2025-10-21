import { assert } from './assert.js'
import { strictEqual } from 'assert'

describe('function/assert', function () {
  it('shall not assert', function () {
    assert(true)
  })

  it('shall assert', function () {
    try {
      assert(false)
    } catch (/** @type {any} */ e) {
      strictEqual(e.message, 'Assertion failed')
    }
  })

  it('shall assert with custom message', function () {
    try {
      assert(false, 'is false')
    } catch (/** @type {any} */ e) {
      strictEqual(e.message, 'is false')
    }
  })

  it('shall not assert on strict equality', function () {
    assert.equal(0, 0)
  })

  it('shall assert if not strict equal', function () {
    try {
      assert.equal(0, '0')
    } catch (/** @type {any} */ e) {
      strictEqual(e.message, 'Assertion failed: 0 !== 0')
    }
  })
})
