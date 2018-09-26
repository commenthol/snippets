import assert from 'assert'
import {isEmpty} from '../../src/object'

describe('object/isEmpty', () => {
  it('undefined', () => {
    assert.strictEqual(isEmpty(), true)
  })
  it('null', () => {
    assert.strictEqual(isEmpty(null), true)
  })
  it('empty object', () => {
    assert.strictEqual(isEmpty({}), true)
  })
  it('empty array', () => {
    assert.strictEqual(isEmpty([]), true)
  })
  it('object', () => {
    assert.strictEqual(isEmpty({a: 1}), false)
  })
  it('array', () => {
    assert.strictEqual(isEmpty([1]), false)
  })
})
