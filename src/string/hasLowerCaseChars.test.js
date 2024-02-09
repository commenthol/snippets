import assert from 'assert'
import { hasLowerCaseChars } from './hasLowerCaseChars.js'

describe('string/hasLowerCaseChars', function () {
  it('shall check for upper case chars', function () {
    assert.strictEqual(hasLowerCaseChars('teSt'), true)
    assert.strictEqual(hasLowerCaseChars('test'), true)
    assert.strictEqual(hasLowerCaseChars('TEST'), false)
  })
})
