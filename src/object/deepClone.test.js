import assert from 'assert'
import { deepClone } from './index.js'

const test = (a, b) => {
  assert.ok(a !== b, 'must have a different reference')
  assert.deepStrictEqual(a, b)
}

describe('object/deepClone', () => {
  it('null', () => {
    const o = null
    const c = deepClone(o)
    assert.strictEqual(o, c)
  })
  it('Number', () => {
    const o = 1
    const c = deepClone(o)
    assert.strictEqual(o, c)
  })
  it('Boolean', () => {
    const o = true
    const c = deepClone(o)
    assert.strictEqual(o, c)
  })
  it('{}', () => {
    const o = {}
    const c = deepClone(o)
    test(c, o)
  })
  it('[]', () => {
    const o = []
    const c = deepClone(o)
    test(c, o)
  })
  it('[[{a: 1}], [{b: 2}]]', () => {
    const o = [[{ a: 1 }], [{ b: 2 }]]
    const c = deepClone(o)
    test(c, o)
    assert.ok(o[0][0] !== c[0][0])
  })
  it('{ aa:[{a: 1}], bb:[{b: 2}]}', () => {
    const o = { aa: [{ a: 1 }], bb: [{ b: 2 }] }
    const c = deepClone(o)
    test(c, o)
  })
  it('Date', () => {
    const o = new Date()
    const c = deepClone(o)
    test(c, o)
  })
  it('RegExp', () => {
    const o = /abc/gi
    const c = deepClone(o)
    test(c, o)
  })
  it('Map', () => {
    const o = new Map([
      ['foo', { a: {} }],
      ['bar', 2],
    ])
    const c = deepClone(o)
    test(c, o)
    assert.ok(o.get('foo').a !== c.get('foo').a)
  })
  it('Set', () => {
    const a = {}
    const o = new Set(['foo', 'bar', a])
    const c = deepClone(o)
    test(c, o)
    assert.ok(o.has(a))
    assert.ok(!c.has(a))
  })
  it('Int8Array', () => {
    const o = new Int8Array([-1, 5, 42, 7])
    const c = deepClone(o)
    test(c, o)
  })
  it('Buffer', () => {
    const o = Buffer.from('abc')
    const c = deepClone(o)
    test(c, o)
  })
  it("won't clone Function", () => {
    const o = function () {}
    o.a = {}
    const c = deepClone(o)
    assert.ok(o === c)
    assert.ok(o.a === c.a)
  })
})
