import assert from 'node:assert'
import { pbkdf2, hexToUint8 } from './index.js'

describe('crypto/pbkdf2', function () {
  it('shall derive a hash using PBKDF2', async function () {
    const secret = 'p@$Sw0rD~1'
    const salt = hexToUint8('aaef2d3f4d77ac66e9c5a6c3d8f921d1')
    const alg = 'SHA-256'
    const iterations = 5e4

    const actual = await pbkdf2(secret, {
      alg,
      salt,
      iterations
    })
    const expected = {
      alg,
      iterations,
      salt,
      hash: hexToUint8(
        '52c5efa16e7022859051b1dec28bc65d9696a3005d0f97e506c42843bc3bdbc0'
      )
    }
    assert.deepEqual(actual, expected)
  })

  it('shall create a new hash', async function () {
    const secret = 'p@$Sw0rD~1'
    const first = await pbkdf2(secret)
    const compared = await pbkdf2(secret, first)
    assert.deepEqual(first.salt, compared.salt)
    assert.deepEqual(first.hash, compared.hash)
  })
})
