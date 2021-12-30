import assert from 'assert'
import { set } from './index.js'

describe('object/set', () => {
  it('should get value from path', () => {
    const obj = {}
    assert.deepStrictEqual(set(obj, ['a', 'b', 'c'], 3), { a: { b: { c: 3 } } })
  })

  it('should append array at `a.b`', () => {
    const obj = { a: { b: [1, 2, 3] } }
    assert.deepStrictEqual(set(obj, ['a', 'b'], 4), { a: { b: [1, 2, 3, 4] } })
  })

  it('should append array `a.b` with object', () => {
    const obj = { a: { b: [1, 2, 3] } }
    assert.deepStrictEqual(set(obj, ['a', 'b'], { c: 3 }), { a: { b: [1, 2, 3, { c: 3 }] } })
  })
})
