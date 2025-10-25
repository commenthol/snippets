import assert from 'node:assert'
import { padEnd } from './index.js'

describe('string/padEnd', function () {
  it('padEnd is a Function', function () {
    assert.ok(typeof padEnd === 'function')
  })
  it('should padEnd on both sides', function () {
    assert.strictEqual(padEnd('cat'), 'cat     ')
  })
  it('should padEnd on 42 with "0"', function () {
    // @ts-ignore
    assert.strictEqual(padEnd(42, 6, 0), '420000')
  })
  it('should truncate as string exceeds length', function () {
    assert.strictEqual(padEnd('foobar', 3), 'foo')
  })
})
