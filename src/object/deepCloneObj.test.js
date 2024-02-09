import assert from 'assert'
import { deepCloneObj } from './index.js'

const test = (a, b) => {
  assert.ok(a !== b, 'must have a different reference')
  assert.deepStrictEqual(a, b)
}

describe('object/deepCloneObj', () => {
  it('null', () => {
    const o = null
    const c = deepCloneObj(o)
    assert.strictEqual(o, c)
  })
  it('Number', () => {
    const o = 1
    const c = deepCloneObj(o)
    assert.strictEqual(o, c)
  })
  it('Boolean', () => {
    const o = true
    const c = deepCloneObj(o)
    assert.strictEqual(o, c)
  })
  it('{}', () => {
    const o = {}
    const c = deepCloneObj(o)
    test(c, o)
  })
  it('[]', () => {
    const o = []
    const c = deepCloneObj(o)
    test(c, o)
  })
  it('[[{a: 1}], [{b: 2}]]', () => {
    const o = [[{ a: 1 }], [{ b: 2 }]]
    const c = deepCloneObj(o)
    test(c, o)
    assert.ok(o[0][0] !== c[0][0])
  })
  it('{ aa:[{a: 1}], bb:[{b: 2}]}', () => {
    const o = { aa: [{ a: 1 }], bb: [{ b: 2 }] }
    const c = deepCloneObj(o)
    test(c, o)
  })
  it('won\'t clone Date', () => {
    const o = new Date()
    const c = deepCloneObj(o)
    test(c, {})
  })
  it('won\'t clone RegExp', () => {
    const o = /abc/ig
    const c = deepCloneObj(o)
    test(c, {})
  })
  it('won\'t clone Map', () => {
    const o = new Map([['foo', { a: {} }], ['bar', 2]])
    const c = deepCloneObj(o)
    test(c, {})
  })
  it('won\'t clone Set', () => {
    const a = {}
    const o = new Set(['foo', 'bar', a])
    const c = deepCloneObj(o)
    test(c, {})
  })
  it('won\'t clone Int8Array', () => {
    const o = new Int8Array([-1, 5, 42, 7])
    const c = deepCloneObj(o)
    test(c, {
      0: -1,
      1: 5,
      2: 42,
      3: 7
    })
  })
  it('won\'t clone Buffer', () => {
    const o = Buffer.from('abc')
    const c = deepCloneObj(o)
    test(c, {
      0: 97,
      1: 98,
      2: 99
    })
  })
  it('won\'t clone Function', () => {
    const o = function () {}
    o.a = {}
    const c = deepCloneObj(o)
    assert.ok(o === c)
    assert.ok(o.a === c.a)
  })
})
