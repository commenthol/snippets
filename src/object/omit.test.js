import assert from 'node:assert'
import { omit } from './index.js'

describe('object/omit', () => {
  it('should omit value from path', () => {
    const obj = { a: 1, b: 2, c: { d: 3 } }
    assert.deepEqual(omit(obj, ['a', 'c']), { b: 2 })
    assert.deepStrictEqual(obj, { a: 1, b: 2, c: { d: 3 } })
  })
  it('should not omit undefined prop', () => {
    const obj = { a: 1, b: 2, c: 3 }
    assert.deepEqual(omit(obj, ['d']), obj)
  })
  it('shall prevent to pick prototype', () => {
    const obj = Object.create({ __proto__: { toString: () => 'hi' } })
    assert.equal(obj.toString(), 'hi')
    const res = omit(obj, ['hi'])
    assert.notEqual(res.toString && res.toString(), 'hi')
  })
})
