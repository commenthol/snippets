import assert from 'assert'
import { ms, msToString } from './ms.js'

describe('date/ms', function () {
  const tests = [
    ['100', 100], // milliseconds
    ['10 seconds', 1e4],
    ['-5.1 secs', -5100],
    ['2 m', 12e4],
    ['3.1 minutes', 186e3],
    ['5hours', 18e6],
    ['2.5 hrs', 9e6],
    ['1 d', 864e5],
    ['7 days', 6048e5],
    ['1 Mo', 26298e5],
    ['2 months', 2 * 26298e5],
    ['1y', 315576e5],
    ['2 years', 2 * 315576e5],
    ['3weeks', 21 * 864e5],
    [1000, 1000],
    ['', undefined],
  ]

  tests.forEach(([inp, exp]) => {
    it(String(inp), function () {
      assert.strictEqual(ms(inp), exp)
    })
  })
})

describe('date/msToString', function () {
  const tests = [
    ['100', 100], // milliseconds
    ['10 seconds', 1e4],
    ['10.7 seconds', 10740, true],
    ['-5.1 seconds', -5100],
    ['2 minutes', 12e4],
    ['5.3 minutes', 318010, true],
    ['3.1 minutes', 186e3],
    ['5 hours', 18e6],
    ['2.5 hours', 9e6],
    ['1 day', 864e5],
    ['1 week', 6048e5],
    ['1 month', 26298e5],
    ['2 months', 2 * 26298e5],
    ['1 year', 315576e5],
    ['2 years', 2 * 315576e5],
    ['3 weeks', 21 * 864e5],
    ['1 second', 1000],
  ]

  tests.forEach(([exp, inp, round]) => {
    it(String(inp), function () {
      assert.strictEqual(msToString(inp, round), exp)
    })
  })
})
