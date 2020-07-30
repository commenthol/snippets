import assert from 'assert'
import { flatten } from '.'

describe('array/flatten', () => {
  it('should flatten array', () => {
    assert.deepStrictEqual(flatten([1, [2], [[3], 4], 5]), [1, 2, 3, 4, 5])
  })
})
