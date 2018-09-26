import assert from 'assert'
import {padEnd} from '../../src/string'

describe('string/padEnd', function () {
  it('padEnd is a Function', function () {
    assert.ok(typeof padEnd === 'function')
  })
  it('should padEnd on both sides', function () {
    assert.equal(padEnd('cat'), 'cat     ')
  })
  it('should padEnd on 42 with "0"', function () {
    assert.equal(padEnd(42, 6, 0), '420000')
  })
  it('should truncate as string exceeds length', function () {
    assert.equal(padEnd('foobar', 3), 'foo')
  })
})
