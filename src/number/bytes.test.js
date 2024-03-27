import assert from 'assert'
import { bytes, bytesToString } from './bytes.js'

describe('number/bytes', function () {
  const tests = [
    ['312', 312],
    ['100kB', 102400],
    ['2.5MB', 2621440],
    [1000, 1000],
    ['', undefined]
  ]

  tests.forEach(([inp, exp]) => {
    it(String(inp), function () {
      assert.strictEqual(bytes(inp), exp)
    })
  })
})

describe('number/bytesToString', function () {
  const tests = [
    ['1000', 1000],
    ['1kB', 1024],
    ['1.5kB', 1524, true],
    ['100kB', 102400],
    ['2.5MB', 2621440],
  ]

  tests.forEach(([exp, inp, round]) => {
    it(String(inp), function () {
      assert.strictEqual(bytesToString(inp, round), exp)
    })
  })
})
