import assert from 'assert'
import { ShuffledArray } from './index.js'

describe('array/ShuffledArray', function () {
  it('shall provide a shuffled list', function () {
    const sh = new ShuffledArray(10)
    const v = sh._values
    assert.strictEqual(v.length, 10)
    assert.deepStrictEqual(v.sort(), [0, 1, 2, 3, 4, 5, 6, 7, 8, 9])
  })

  it('shall get fresh list', function () {
    const sh = new ShuffledArray(3)
    const v = []
    for (let i = 0; i < 6; i++) {
      v.push(sh.next())
    }
    assert.deepStrictEqual(v.sort(), [0, 0, 1, 1, 2, 2])
  })
})
