import assert from 'assert'
import { padStart } from './index.js'

describe('string/padStart', function () {
  it('padStart is a Function', function () {
    assert.ok(typeof padStart === 'function')
  })
  it('should padStart on both sides', function () {
    assert.strictEqual(padStart('cat'), '     cat')
  })
  it('should padStart on 42 with "0"', function () {
    assert.strictEqual(padStart(42, 6, 0), '000042')
  })
  it('should truncate as string exceeds length', function () {
    assert.strictEqual(padStart('foobar', 3), 'bar')
  })
})
