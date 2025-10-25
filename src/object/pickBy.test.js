import assert from 'node:assert'
import { pickBy } from './index.js'

describe('object/pickBy', () => {
  it('should pick all strings', () => {
    const obj = { a: 1, b: 2, c: '3' }
    const fn = (str) => typeof str === 'string'
    assert.deepEqual(pickBy(obj, fn), { c: '3' })
  })

  it('shall prevent to pick prototype', () => {
    const obj = Object.create({ __proto__: { toString: () => 'hi' } })
    assert.equal(obj.toString(), 'hi')
    const fn = () => true
    const res = pickBy(obj, fn)
    console.log(res)
    assert.notEqual(res.toString && res.toString(), 'hi')
  })
})
