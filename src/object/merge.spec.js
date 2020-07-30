import assert from 'assert'
import { merge } from '.'

describe('object/merge', () => {
  it('should merge', () => {
    const obj = { a: { b: { c: 1 } } }
    const target = {}
    assert.deepStrictEqual(merge(target, obj), obj)
  })
  it('should merge 2 objects', () => {
    const target = { a: { b: 3 } }
    const obj1 = { a: { b: { c: 1 } } }
    const obj2 = { a: { d: { e: 2 } } }
    const exp = { a: { b: { c: 1 }, d: { e: 2 } } }
    const res = merge(target, obj1, obj2)
    assert.deepStrictEqual(res, exp)
  })
  it('should merge other 2 objects', () => {
    const target = { a: { b: { c: 1 } } }
    const obj1 = { a: { b: 3 } }
    const obj2 = { a: { d: { e: 2 } } }
    const exp = { a: { b: 3, d: { e: 2 } } }
    const res = merge(target, obj1, obj2)
    assert.deepStrictEqual(res, exp)
  })
  it('should merge object with arrays', () => {
    const target = { a: { b: [{ c: 1 }] } }
    const obj1 = { a: { b: [{ c: 2, d: 2 }, { e: 2 }] } }
    const obj2 = { a: [1, 2, 3] }
    const exp = { a: { 0: 1, 1: 2, 2: 3, b: { 0: { c: 2, d: 2 }, 1: { e: 2 } } } }
    const res = merge(target, obj1, obj2)
    assert.deepStrictEqual(res, exp)
  })
  it('should merge base obj', () => {
    const target = { a: 1 }
    const obj1 = { a: 2 }
    const exp = { a: 2 }
    const res = merge(target, obj1)
    assert.deepStrictEqual(res, exp)
  })
  it('should be save against prototype pollution', function () {
    const payload = '{"__proto__":{"oops":"It works !"}}'
    var a = {}
    merge({}, JSON.parse(payload))
    assert.strictEqual(a.oops, undefined)
  })
})
