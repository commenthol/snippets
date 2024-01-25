import assert from 'assert'
import { pick } from './index.js'

describe('object/pick', () => {
  it('should pick value from path', () => {
    const obj = { a: 1, b: 2, c: 3 }
    assert.deepEqual(pick(obj, ['a', 'c']), { a: 1, c: 3 })
  })
  it('should not pick undefined prop', () => {
    const obj = { a: 1, b: 2, c: 3 }
    assert.deepEqual(pick(obj, ['d']), {})
  })
  it('shall prevent to pick prototype', () => {
    const obj = Object.create({ __proto__: { toString: () => 'hi' } })
    assert.equal(obj.toString(), 'hi')
    const res = pick(obj, ['__proto__'])
    assert.notEqual(res.toString && res.toString(), 'hi')
  })
})
