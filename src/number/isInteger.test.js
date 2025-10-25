import assert from 'node:assert'
import { isInteger } from './index.js'

describe('number/isInteger', function () {
  it('number', function () {
    assert.strictEqual(isInteger(3), true)
  })

  it('number as string', function () {
    assert.strictEqual(isInteger('3'), true)
  })

  it('string', function () {
    assert.strictEqual(isInteger('foobar'), false)
  })

  it('MIN_VALUE', function () {
    assert.strictEqual(isInteger(Number.MIN_VALUE), false)
  })

  it('Infinity', function () {
    assert.strictEqual(isInteger(Infinity), false)
  })
})
