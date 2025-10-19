import assert from 'assert'
import { customSortStrings } from './index.js'

describe('array/customSort', function () {
  it('shall sort ascending', function () {
    const arr = ['hi', 'hello', 'world', 'there']
    const sortBy = ['he', 'hi']
    const result = customSortStrings(arr, sortBy)
    assert.deepStrictEqual(result, ['hello', 'hi', 'there', 'world'])
  })

  it('shall sort descending', function () {
    const arr = ['hi', 'hello', 'world', 'there']
    const sortBy = ['he', 'hi']
    const result = customSortStrings(arr, sortBy, { desc: true })
    assert.deepStrictEqual(result, ['hello', 'hi', 'there', 'world'].reverse())
  })

  it('shall use custom chars only', function () {
    const arr = ['hi', 'hello', 'world', 'there', 'hahe']
    const sortBy = ['he', 'hi']
    const result = customSortStrings(arr, sortBy, { custom: true })
    assert.deepStrictEqual(result, ['hello', 'hi', 'there', 'hahe', 'world'])
  })

  it('shall not fail to sort same words', function () {
    const arr = ['hello', 'hello']
    const sortBy = ['he', 'hi']
    const result = customSortStrings(arr, sortBy, { custom: true })
    assert.deepStrictEqual(result, ['hello', 'hello'])
  })
})
