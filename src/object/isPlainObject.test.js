import assert from 'assert'
import { isPlainObject } from './index.js'

describe('object/isPlainObject', () => {
  it('null', () => {
    assert.strictEqual(isPlainObject(null), false)
  })
  it('{}', () => {
    assert.strictEqual(isPlainObject({}), true)
  })
  it('{a: 1}', () => {
    assert.strictEqual(isPlainObject({ a: 1 }), true)
  })
  it('new F()', () => {
    function F () {
      this.a = 1
    }
    assert.strictEqual(isPlainObject(new F()), false)
  })
  it('string', () => {
    assert.strictEqual(isPlainObject('null'), false)
  })
  it('number', () => {
    assert.strictEqual(isPlainObject(12), false)
  })
})
