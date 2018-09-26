import assert from 'assert'
import {uniq} from '../../src/array'

describe('array/uniq', () => {
  it('should uniq array', () => {
    assert.deepEqual(uniq([1, 3, 2, 4, 4, 2, 0]), [ 1, 3, 2, 4, 0 ])
  })
})
