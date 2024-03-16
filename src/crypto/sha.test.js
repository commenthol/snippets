import assert from 'assert'
import { sha } from './sha.js'
import { uint8ToHex } from './index.js'

describe('crypto/sha', function () {
  it('shall hash empty string', async function () {
    const hashBuf = await sha('')
    const actual = uint8ToHex(hashBuf)
    const expected =
      'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    assert.equal(actual, expected)
  })

  it('shall hash arraybuffer', async function () {
    const value = 'The quick brown fox jumps over the lazy dog.'
    const buf = new TextEncoder().encode(value)
    const hashBuf = await sha(buf)
    const actual = uint8ToHex(hashBuf)
    const expected =
      'ef537f25c895bfa782526529a9b63d97aa631564d5d789c2b765448c8635fb6c'
    assert.equal(actual, expected)
  })
})
