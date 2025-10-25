import assert from 'node:assert'
import { padES6 } from './index.js'

describe('string/padES6', function () {
  it('pad is a Function', function () {
    assert.ok(typeof padES6 === 'function')
  })
  it('should pad on both sides', function () {
    assert.strictEqual(padES6('cat'), '  cat   ')
  })
  it('should pad on 42 with "0"', function () {
    // @ts-ignore
    assert.strictEqual(padES6(String(42), 6, 0), '004200')
  })
  it('should truncate as string exceeds length', function () {
    assert.strictEqual(padES6('foobar', 3), 'foobar')
  })
})
