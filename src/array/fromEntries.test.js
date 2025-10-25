import assert from 'node:assert'
import { fromEntries, fromEntriesNative } from './index.js'

describe('array/fromEntries', () => {
  const arr = [
    ['a', 1],
    ['b', 2],
    ['c', 3],
  ]
  const exp = { a: 1, b: 2, c: 3 }

  it('should build object ES2021', () => {
    assert.deepStrictEqual(fromEntries(arr), exp)
  })

  it('should build object', () => {
    assert.deepStrictEqual(fromEntriesNative(arr), exp)
  })
})
