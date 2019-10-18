import assert from 'assert'
import { stringifyCircular as stringify } from '../../src/object'

describe('object/stringify', () => {
  it('should stringify object', () => {
    const obj = { a: 'b' }
    const res = stringify(obj)
    assert.strictEqual(res, '{"a":"b"}')
  })
  it('should stringify referenced object', () => {
    const o = { b: 1 }
    const obj = { a: o, c: o }
    const res = stringify(obj)
    assert.strictEqual(res, '{"a":{"b":1},"c":{"b":1}}')
  })
  it('should stringify circular object', () => {
    const obj = { a: {} }
    obj.a = obj
    const res = stringify(obj)
    assert.strictEqual(res, '{}')
  })
  it('should stringify circular object with additional property', () => {
    const obj = { a: { b: 1 } }
    obj.a.c = obj
    obj.a.c.a.d = 3
    const res = stringify(obj)
    assert.strictEqual(res, '{"a":{"b":1,"d":3}}')
  })
})
