import assert from 'assert'
import {flatten} from '../../src/array'

describe('array/flatten', () => {
  it('should flatten array', () => {
    assert.deepEqual(flatten([1, [2], [[3], 4], 5]), [1, 2, 3, 4, 5])
  })
})