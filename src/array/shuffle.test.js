import assert from 'node:assert'
import { shuffle } from './index.js'

describe('array/shuffle', function () {
  it('shall shuffle an array', function () {
    const arr = [1, 2, 3, 4, 5, 6]
    const shuffled = shuffle(arr)
    assert.ok(arr !== shuffled, 'shall have a different reference')
    assert.ok(
      shuffled.some((v, i) => arr[i] !== v),
      'shuffled array shall have different set of values'
    )
  })
})
