import assert from 'assert'
import { difference } from './index.js'

describe('array/difference', function () {
  it('shall filter for difference', function () {
    assert.deepStrictEqual(difference([2, 1], [3, 2]), [1])
  })
})
