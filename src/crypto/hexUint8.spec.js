import assert from 'node:assert/strict'
import { uint8ToHex, hexToUint8 } from './hexUint8.js'

describe('crypto/hexUint8', function () {
  const str = 'abc ABC Text \x00 👏🏽 🇺🇳 👩🏼‍🦱'
  const arr = Uint8Array.from(Buffer.from(str))

  it('shall hex encode Uint8Array', function () {
    const b64Encoded = uint8ToHex(arr)
    assert.equal(b64Encoded, Buffer.from(str).toString('hex'))
  })

  it('shall decode hex string to Uint8Array', function () {
    const decoded = hexToUint8(Buffer.from(str).toString('hex'))
    assert.deepEqual(decoded, arr)
  })

  it('shall partially decode', function () {
    assert.deepEqual(hexToUint8('abcdfoobarx'), Uint8Array.from([171, 205, 15]))
  })
})
