import assert from 'assert'
import { pad } from '.'

describe('string/pad', function () {
  it('pad is a Function', function () {
    assert.ok(typeof pad === 'function')
  })
  it('should pad on both sides', function () {
    assert.strictEqual(pad('cat'), '  cat   ')
  })
  it('should pad on 42 with "0"', function () {
    assert.strictEqual(pad(42, 6, 0), '004200')
  })
  it('should truncate as string exceeds length', function () {
    assert.strictEqual(pad('foobar', 3), 'oba')
  })
})
