import assert from 'assert'
import { arrayify } from './index.js'

describe('object/arrayify', function () {
  it('shall move all values in array if not already an array', function () {
    const obj = {
      one: 1,
      two: [2, 22],
      three: 3,
    }

    const result = arrayify(obj)

    assert.deepStrictEqual(result, {
      one: [1],
      two: [2, 22],
      three: [3],
    })
  })

  it('result has same reference', function () {
    const obj = { one: [1], two: [2, 3] }
    const result = arrayify(obj)
    assert.ok(result === obj)
  })

  it('shall only move some keys into array', function () {
    const obj = {
      foo: 1,
      bar: 2,
      wat: 3,
    }

    const result = arrayify(obj, ['foo', 'bar'])

    assert.deepStrictEqual(result, {
      foo: [1],
      bar: [2],
      wat: 3,
    })
  })
})
