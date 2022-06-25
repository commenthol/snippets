import assert from 'assert'
import { toInteger } from './index.js'

describe('number/toInteger', function () {
  it('number', function () {
    assert.strictEqual(toInteger(3), 3)
  })

  it('number as string', function () {
    assert.strictEqual(toInteger('3'), 3)
  })

  it('string', function () {
    assert.strictEqual(toInteger('foobar'), undefined)
  })

  it('MIN_VALUE', function () {
    assert.strictEqual(toInteger(Number.MIN_VALUE), undefined)
  })

  it('Infinity', function () {
    assert.strictEqual(toInteger(Infinity), undefined)
  })
})
