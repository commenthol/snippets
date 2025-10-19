import assert from 'assert'
import { equal, equalSimple } from './index.js'

describe('object/equal', () => {
  describe('equalSimple', function () {
    it('should be equal', () => {
      assert.strictEqual(equalSimple({}, {}), true)
    })

    it('should not be equal', () => {
      assert.strictEqual(equalSimple({}, null), false)
    })
  })

  describe('equal', function () {
    it('should be equal', () => {
      assert.strictEqual(equal({}, {}), true)
      assert.strictEqual(equal(), true)
      assert.strictEqual(equal(5, 5), true)
      assert.strictEqual(equal('A', 'A'), true)
      assert.strictEqual(equal(new Date(123), new Date(123)), true)
    })

    it('should no be equal', () => {
      assert.strictEqual(equal({}, null), false)
      assert.strictEqual(equal(5, '5'), false)
      assert.strictEqual(equal(5, '6'), false)
      assert.strictEqual(equal('', '6'), false)
      assert.strictEqual(equal(6, ''), false)
      assert.strictEqual(equal(undefined, '6'), false)
      assert.strictEqual(equal(new Date(123), new Date(124)), false)
    })

    it('shall compare deep equal', function () {
      assert.strictEqual(
        equal(
          { a: [2, { e: 3 }], b: [4], c: 'foo' },
          { a: [2, { e: 3 }], b: [4], c: 'foo' }
        ),
        true
      )
    })

    it('shall fail on wrong type', function () {
      assert.strictEqual(equal([1, 2, 3], { 0: 1, 1: 2, 2: 3 }), false)
    })

    it('shall pass on same circularities', function () {
      const a = { b: { bb: 1 }, c: { cc: 2 } }
      a.b.c = a.b

      const b = { b: { bb: 1 }, c: { cc: 2 } }
      b.b.c = b.b

      assert.strictEqual(equal(a, b), true)
    })

    it('shall fail on different circularities', function () {
      const a = { b: { bb: 1 }, c: { cc: 2 } }
      a.b.c = a.b

      const b = { b: { bb: 1 }, c: { cc: 2 } }
      b.c.c = b.b

      assert.strictEqual(equal(a, b), false)
    })
  })
})
