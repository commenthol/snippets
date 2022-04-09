import assert from 'assert'
import { ms } from './ms.js'

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
    ['2 years', 2 * 315576e5]
  ]

  tests.forEach(([inp, exp]) => {
    it(String(inp), function () {
      assert.strictEqual(ms(inp), exp)
    })
  })
})
