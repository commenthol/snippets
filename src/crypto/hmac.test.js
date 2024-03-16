import assert from 'node:assert'
import { hexToUint8, hmacSign, hmacVerify } from './index.js'

describe('crypto/hmac', function () {
  it('shall sign with hmac SHA-256', async function () {
    const data = new TextEncoder().encode(
      'The quick brown fox jumps over the lazy dog'
    )
    const actual = await hmacSign('key', data)
    const expected = hexToUint8(
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'
    )
    assert.deepEqual(actual, expected)
  })

  it('shall verify with hmac SHA-256', async function () {
    const data = new TextEncoder().encode(
      'The quick brown fox jumps over the lazy dog'
    )
    const signature = hexToUint8(
      'f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8'
    )
    const actual = await hmacVerify('key', signature, data)
    assert.equal(actual, true)
  })
})
