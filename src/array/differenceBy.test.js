import assert from 'assert'
import { differenceBy } from './index.js'

describe('array/differenceBy', function () {
  it('shall filter by Math.floor', function () {
    assert.deepStrictEqual(differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor), [
      1.2,
    ])
  })
  it('shall filter by iteratee shorthand', function () {
    assert.deepStrictEqual(
      differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], 'x'),
      [{ x: 2 }]
    )
  })
})
