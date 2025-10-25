import assert from 'node:assert'
import { uniq } from './index.js'

describe('array/uniq', () => {
  it('should uniq array', () => {
    assert.deepStrictEqual(uniq([1, 3, 2, 4, 4, 2, 0]), [1, 3, 2, 4, 0])
  })
})
