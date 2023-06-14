import assert from 'node:assert/strict'
import { uint8ToBase64, base64ToUint8 } from './base64Uint8.js'

describe('crypto/base64Uint8', function () {
  const str = 'abc ABC Text \x00 👏🏽 🇺🇳 👩🏼‍🦱'
  const arr = Uint8Array.from(unescape(encodeURIComponent(str)).split('').map(c => c.charCodeAt(0)))

  it('shall base64 encode Uint8Array', function () {
    const b64Encoded = uint8ToBase64(arr)
    assert.equal(b64Encoded, Buffer.from(str).toString('base64'))
  })

  it('shall decode base64 string to Uint8Array', function () {
    const decoded = base64ToUint8(Buffer.from(str).toString('base64'))
    assert.deepEqual(decoded, arr)
  })
})
