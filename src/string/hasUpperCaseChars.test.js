import assert from 'assert'
import { hasUpperCaseChars } from './hasUpperCaseChars.js'

describe('string/hasUpperCaseChars', function () {
  it('shall check for upper case chars', function () {
    assert.strictEqual(hasUpperCaseChars('teSt'), true)
    assert.strictEqual(hasUpperCaseChars('test'), false)
    assert.strictEqual(hasUpperCaseChars('TEST'), true)
  })
})
