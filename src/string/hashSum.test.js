import assert from 'assert'
import { hashSum } from './hashSum.js'

// assert.strictEqual = console.log

describe('string/hash', function () {
  it('shall hash true', () => {
    assert.strictEqual(hashSum(true), '8842c67c')
  })
  it('shall hash 0', () => {
    assert.strictEqual(hashSum(0), '5a833586')
  })
  it('shall hash empty string', () => {
    assert.strictEqual(hashSum(''), '05946301')
  })
  it('shall hash null', () => {
    assert.strictEqual(hashSum(null), 'dd635fac')
  })
  it('shall hash undefined', () => {
    assert.strictEqual(hashSum(undefined), '34b1362e')
  })
  it('shall hash a string', () => {
    assert.strictEqual(hashSum('abcdef'), '60a8385a')
  })
  it('shall hash an object', () => {
    assert.strictEqual(hashSum({ plain: [] }), '650d7b29')
  })
  it('shall hash an object of objects', () => {
    assert.strictEqual(
      hashSum({ a: { aa: 1, ab: 2 }, b: { bb: 3, bc: 4 } }),
      hashSum({ b: { bb: 3, bc: 4 }, a: { ab: 2, aa: 1 } })
    )
  })
  it('shall hash an array', () => {
    assert.strictEqual(hashSum([1, 2, 3, 4]), '9b3e83ec')
  })
  it('shall hash a function', () => {
    assert.strictEqual(
      hashSum(function test(a) {
        return a
      }),
      '2685e2ba'
    )
  })
  it('shall hash a NaN', () => {
    assert.strictEqual(hashSum(NaN), '7420643f')
  })
  it('shall hash a Date', () => {
    assert.strictEqual(hashSum(new Date('2022-01-31T21:21:21Z')), '6b295c32')
  })
  it('shall hash a Set', () => {
    assert.strictEqual(hashSum(new Set([1, 4, 7, 2])), '9adcfff2')
  })
  it('shall hash a Map', () => {
    assert.strictEqual(
      hashSum(
        new Map([
          ['a', 4],
          ['b', 2],
        ])
      ),
      '70498552'
    )
  })
  it('shall hash 1e8', () => {
    assert.strictEqual(hashSum(1e8), 'c5667d02')
  })
  it('shall hash circular object', () => {
    const o = { a: { b: 1 } }
    o.a.c = o.a
    assert.strictEqual(hashSum(o), '1e50cd6e')
  })

  // measures the number of collisions by counting from 0 to ...
  // run this test with `--max_old_space_size=8000`
  it.skip('collisions', function () {
    this.timeout(1e10)

    class MySet {
      constructor() {
        this.sets = {}
      }

      _set(h) {
        const part = h.substring(0, 2)
        this.sets[part] = this.sets[part] || new Set()
        return this.sets[part]
      }

      add(h) {
        return this._set(h).add(h)
      }

      has(h) {
        return this._set(h).has(h)
      }
    }

    const m = new MySet()
    let collisions = 0
    // we ran into https://bugs.chromium.org/p/v8/issues/detail?id=11852
    // RangeError: Value undefined out of range for undefined options property undefined
    // as OrderedHashTables in v8 only handles 16777216 entries
    for (let i = 0; i < 5.8e7; i++) {
      const h = hashSum(i)
      if (m.has(h)) {
        collisions++
      }
      m.add(h)
    }
    console.log(`number of collisions ${collisions}`)
    // count  collisions  %  exectime
    // 1e6    0               1s
    // 1e7    0              11s
    // 5e7    0              69s
    // 5.5e7  0              72s
    // 5.8e7  544320  0.9%   80s
    // 6e7    907200  1.5%   82s
    // 7e7    907200  1.2%   92s
    // 1e8    917120  0.9%  120s
  })
})
