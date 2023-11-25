import crypto from 'crypto'
import assert from 'assert'
import { jwtEncode } from './jwtEncode.js'
import { jwtDecode, verifySignature } from './jwtDecode.js'
import { privateKeyRsaPem, publicKeyRsaPem } from './jwtDecode.spec.js'

describe('string/jwtEncode', function () {
  const privateRsaKey = crypto.createPrivateKey({
    key: privateKeyRsaPem,
    format: 'pem',
    type: 'pkcs8'
  })
  const publicRsaKey = crypto.createPublicKey({
    key: publicKeyRsaPem,
    format: 'pem',
    type: 'spki'
  })

  it('no algorithm', function () {
    try {
      jwtEncode()
      throw new Error('fail')
    } catch (err) {
      assert.equal(err.message, 'unsupported algorithm undefined')
    }
  })

  it('HS256', function () {
    const secret = 'your-256-bit-secret'
    const token = jwtEncode(
      'HS256',
      { sub: '1234567890', name: 'John Doe' },
      { secret }
    )

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    const { iat, exp, ...other } = payload

    assert.deepStrictEqual(
      { header, payload: other },
      {
        header: {
          alg: 'HS256',
          typ: 'JWT'
        },
        payload: {
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )
    assert.strictEqual(verifySignature(decoded, { secret }), true)
  })

  it('HS384', function () {
    const secret = 'your-384-bit-secret'
    const token = jwtEncode(
      'HS384',
      { sub: '1234567890', name: 'John Doe' },
      { secret }
    )

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    const { iat, exp, ...other } = payload

    assert.deepStrictEqual(
      { header, payload: other },
      {
        header: {
          alg: 'HS384',
          typ: 'JWT'
        },
        payload: {
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )
    assert.strictEqual(verifySignature(decoded, { secret }), true)
  })

  it('HS512', function () {
    const secret = 'your-512-bit-secret'
    const token = jwtEncode(
      'HS512',
      { sub: '1234567890', name: 'John Doe' },
      { secret }
    )

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    const { iat, exp, ...other } = payload

    assert.deepStrictEqual(
      { header, payload: other },
      {
        header: {
          alg: 'HS512',
          typ: 'JWT'
        },
        payload: {
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )
    assert.strictEqual(verifySignature(decoded, { secret }), true)
  })

  it('RS256', async function () {
    const token = jwtEncode(
      'RS256',
      { sub: '1234567890', name: 'John Doe' },
      { key: privateRsaKey }
    )

    console.log(token)

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    const { iat, exp, ...other } = payload

    assert.deepStrictEqual(
      { header, payload: other },
      {
        header: {
          alg: 'RS256',
          typ: 'JWT'
        },
        payload: {
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )

    assert.strictEqual(
      verifySignature(decoded, { publicKey: publicRsaKey }),
      true
    )
  })
})
