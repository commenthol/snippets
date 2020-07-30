import assert from 'assert'
import { omit } from '.'

describe('object/omit', () => {
  it('should omit value from path', () => {
    const obj = { a: 1, b: 2, c: { d: 3 } }
    assert.deepStrictEqual(omit(obj, ['a', 'c']), { b: 2 })
    assert.deepStrictEqual(obj, { a: 1, b: 2, c: { d: 3 } })
  })
  it('should not omit undefined prop', () => {
    const obj = { a: 1, b: 2, c: 3 }
    assert.deepStrictEqual(omit(obj, ['d']), obj)
  })
})
