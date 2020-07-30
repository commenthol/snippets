import assert from 'assert'
import { uniq } from '.'

describe('array/uniq', () => {
  it('should uniq array', () => {
    assert.deepStrictEqual(uniq([1, 3, 2, 4, 4, 2, 0]), [1, 3, 2, 4, 0])
  })
})
