import assert from 'assert'
import {omit} from '../../src/object'

describe('object/omit', () => {
  it('should omit value from path', () => {
    const obj = {a: 1, b: 2, c: {d: 3}}
    assert.deepEqual(omit(obj, ['a', 'c']), {b: 2})
    assert.deepEqual(obj, {a: 1, b: 2, c: {d: 3}})
  })
  it('should not omit undefined prop', () => {
    const obj = {a: 1, b: 2, c: 3}
    assert.deepEqual(omit(obj, ['d']), obj)
  })
})
