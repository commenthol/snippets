import assert from 'node:assert/strict'
import { getDerivedKey, encrypt, decrypt } from './aes256gcm.js'

describe('crypto/aes256gcm', function () {
  it('shall en- and decode string with secret', async function () {
    this.timeout(3e3)
    const variant = 1
    const encoding = 'base64'
    const secret = 'foobar'
    const data = 'this is foobar👂🏻 huuh🏳️‍🌈'
    const derivedKey = await getDerivedKey(secret, { variant })
    const cipherText = await encrypt(data, derivedKey, { encoding })
    const result = await decrypt(cipherText, secret, { encoding })
    assert.equal(result, data)
  })
})
