import assert from 'assert'
import { omitBy } from './index.js'

describe('object/omitBy', () => {
  it('should omit all strings', () => {
    const obj = { a: 1, b: 2, c: '3' }
    const fn = (str) => typeof str === 'string'
    assert.deepEqual(omitBy(obj, fn), { a: 1, b: 2 })
  })
})
