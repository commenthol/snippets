import assert from 'node:assert'
import { isNumber } from './index.js'

describe('number/isNumber', function () {
  const tests = [
    [true, Number.MIN_SAFE_INTEGER],
    [true, 1.2e3],
    [true, 0xaa],
    [true, -2.7],
    [true, 0],
    [true, 3.1415],
    [true, Math.PI],
    [true, '1.2e3'],
    [true, '0xaa'],
    [true, '-2.7'],
    [true, '0'],
    [true, '3.1415'],
    [true, Number.MAX_SAFE_INTEGER],
    [true, parseInt('012')],
    [true, parseFloat('012.012')],
    [false, Infinity],
    [false, NaN],
    [false, null],
    [false, undefined],
    [false, ''],
    [false, '  '],
    [false, 'string'],
    [false, []],
    [false, [1]],
    [false, () => 1],
    [false, {}],
  ]

  tests.forEach(([expected, value]) => {
    it(`should return ${expected} for ${value}`, function () {
      assert.strictEqual(isNumber(value), expected)
    })
  })
})
