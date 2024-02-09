import assert from 'assert'
import { isCircular } from './index.js'

describe('object/isCircular', () => {
  it('should stringify object', () => {
    const obj = { a: 'b' }
    assert.strictEqual(isCircular(obj), false)
  })
  it('should stringify referenced object', () => {
    const o = { b: 1 }
    const obj = { a: o, c: o }
    assert.strictEqual(isCircular(obj), false)
  })
  it('should stringify circular object', () => {
    const obj = { a: {} }
    obj.a = obj
    assert.strictEqual(isCircular(obj), true)
  })
  it('should stringify circular object with additional property', () => {
    const obj = { a: { b: 1 } }
    obj.a.c = obj
    obj.a.c.a.d = 3
    assert.strictEqual(isCircular(obj), true)
  })
})
