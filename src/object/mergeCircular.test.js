import assert from 'node:assert'
import {
  mergeCircular as merge,
  stringifyCircular as stringify,
} from './index.js'

describe('object/mergeCircular', () => {
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
    const exp = {
      a: { 0: 1, 1: 2, 2: 3, b: { 0: { c: 2, d: 2 }, 1: { e: 2 } } },
    }
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
    const a = {}
    merge({}, JSON.parse(payload))
    assert.strictEqual(a.oops, undefined)
  })
  it('should merge circular objects', function () {
    const o1 = { a: {} }
    o1.a.c = o1.a
    const o2 = { a: { b: {} } }
    o2.a.b.c = o2.a.b
    const res = merge({}, o1, o2)
    // { a: { c: { c: [Circular] }, b: { c: [Circular] } } }
    const exp = { a: { c: {}, b: {} } }
    exp.a.c.c = exp.a
    exp.a.b.c = exp.a.b
    const reparse = (o) => JSON.parse(stringify(o))
    assert.deepStrictEqual(reparse(res), reparse(exp))
  })

  it('shall prevent prototype pollution', () => {
    const obj = {}
    const vuln = Object.create({ __proto__: { toString: () => 'hi' } })
    assert.equal(vuln.toString(), 'hi')
    const res = merge(obj, vuln)
    assert.equal(res.toString(), '[object Object]')
  })
})
