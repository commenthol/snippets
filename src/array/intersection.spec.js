import assert from 'assert/strict'
import { intersection } from './intersection.js'

describe('array/intersection', () => {
  it('empty arrays', () => {
    assert.deepEqual(
      intersection([], []),
      []
    )
  })

  it('no match', () => {
    assert.deepEqual(
      intersection([3], [1, 2]),
      []
    )
  })

  it('no match reversed', () => {
    assert.deepEqual(
      intersection([1, 2], [3]),
      []
    )
  })

  it('found', () => {
    assert.deepEqual(
      intersection([1, 2], [3, 2]),
      [2]
    )
  })

  it('found multiple', () => {
    assert.deepEqual(
      intersection([1, 2, 3, 4], [3, 4, 2, 5]),
      [2, 3, 4]
    )
  })

  it('same', () => {
    assert.deepEqual(
      intersection([1, 2, 3], [3, 2, 1]),
      [1, 2, 3]
    )
  })

  it('no match type mismatch', () => {
    assert.deepEqual(
      intersection([1, 2], [3, '2']),
      []
    )
  })

  it('match undefined', () => {
    assert.deepEqual(
      intersection([undefined], ['a', undefined]),
      [undefined]
    )
  })
})
