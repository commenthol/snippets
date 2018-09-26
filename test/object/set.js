import assert from 'assert'
import {set} from '../../src/object'

describe('object/set', () => {
  it('should get value from path', () => {
    const obj = {}
    assert.deepEqual(set(obj, ['a', 'b', 'c'], 3), {a: {b: {c: 3}}})
  })
  it('should overwrite `a.b`', () => {
    const obj = {a: {b: [1, 2, 3]}}
    assert.deepEqual(set(obj, ['a', 'b'], 3), { a: { b: 3 } })
  })
})
