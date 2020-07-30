import assert from 'assert'
import { set } from '.'

describe('object/set', () => {
  it('should get value from path', () => {
    const obj = {}
    assert.deepStrictEqual(set(obj, ['a', 'b', 'c'], 3), { a: { b: { c: 3 } } })
  })
  it('should overwrite `a.b`', () => {
    const obj = { a: { b: [1, 2, 3] } }
    assert.deepStrictEqual(set(obj, ['a', 'b'], 3), { a: { b: 3 } })
  })
})
