import assert from 'assert'
import { pickBy } from '.'

describe('object/pickBy', () => {
  it('should pick all strings', () => {
    const obj = { a: 1, b: 2, c: '3' }
    const fn = (str) => typeof str === 'string'
    assert.deepStrictEqual(pickBy(obj, fn), { c: '3' })
  })
})
