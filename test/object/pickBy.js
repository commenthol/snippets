import assert from 'assert'
import {pickBy} from '../../src/object'

describe('object/pickBy', () => {
  it('should pick all strings', () => {
    const obj = {a: 1, b: 2, c: '3'}
    const fn = (str) => typeof str === 'string'
    assert.deepEqual(pickBy(obj, fn), {c: 3})
  })
})