import crypto from 'crypto'
import assert from 'assert'
import { jwtDecode, verifySignature } from './jwtVerify.js'

export const privateKeyRsaPem = `-----BEGIN PRIVATE KEY-----
MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC7VJTUt9Us8cKj
MzEfYyjiWA4R4/M2bS1GB4t7NXp98C3SC6dVMvDuictGeurT8jNbvJZHtCSuYEvu
NMoSfm76oqFvAp8Gy0iz5sxjZmSnXyCdPEovGhLa0VzMaQ8s+CLOyS56YyCFGeJZ
qgtzJ6GR3eqoYSW9b9UMvkBpZODSctWSNGj3P7jRFDO5VoTwCQAWbFnOjDfH5Ulg
p2PKSQnSJP3AJLQNFNe7br1XbrhV//eO+t51mIpGSDCUv3E0DDFcWDTH9cXDTTlR
ZVEiR2BwpZOOkE/Z0/BVnhZYL71oZV34bKfWjQIt6V/isSMahdsAASACp4ZTGtwi
VuNd9tybAgMBAAECggEBAKTmjaS6tkK8BlPXClTQ2vpz/N6uxDeS35mXpqasqskV
laAidgg/sWqpjXDbXr93otIMLlWsM+X0CqMDgSXKejLS2jx4GDjI1ZTXg++0AMJ8
sJ74pWzVDOfmCEQ/7wXs3+cbnXhKriO8Z036q92Qc1+N87SI38nkGa0ABH9CN83H
mQqt4fB7UdHzuIRe/me2PGhIq5ZBzj6h3BpoPGzEP+x3l9YmK8t/1cN0pqI+dQwY
dgfGjackLu/2qH80MCF7IyQaseZUOJyKrCLtSD/Iixv/hzDEUPfOCjFDgTpzf3cw
ta8+oE4wHCo1iI1/4TlPkwmXx4qSXtmw4aQPz7IDQvECgYEA8KNThCO2gsC2I9PQ
DM/8Cw0O983WCDY+oi+7JPiNAJwv5DYBqEZB1QYdj06YD16XlC/HAZMsMku1na2T
N0driwenQQWzoev3g2S7gRDoS/FCJSI3jJ+kjgtaA7Qmzlgk1TxODN+G1H91HW7t
0l7VnL27IWyYo2qRRK3jzxqUiPUCgYEAx0oQs2reBQGMVZnApD1jeq7n4MvNLcPv
t8b/eU9iUv6Y4Mj0Suo/AU8lYZXm8ubbqAlwz2VSVunD2tOplHyMUrtCtObAfVDU
AhCndKaA9gApgfb3xw1IKbuQ1u4IF1FJl3VtumfQn//LiH1B3rXhcdyo3/vIttEk
48RakUKClU8CgYEAzV7W3COOlDDcQd935DdtKBFRAPRPAlspQUnzMi5eSHMD/ISL
DY5IiQHbIH83D4bvXq0X7qQoSBSNP7Dvv3HYuqMhf0DaegrlBuJllFVVq9qPVRnK
xt1Il2HgxOBvbhOT+9in1BzA+YJ99UzC85O0Qz06A+CmtHEy4aZ2kj5hHjECgYEA
mNS4+A8Fkss8Js1RieK2LniBxMgmYml3pfVLKGnzmng7H2+cwPLhPIzIuwytXywh
2bzbsYEfYx3EoEVgMEpPhoarQnYPukrJO4gwE2o5Te6T5mJSZGlQJQj9q4ZB2Dfz
et6INsK0oG8XVGXSpQvQh3RUYekCZQkBBFcpqWpbIEsCgYAnM3DQf3FJoSnXaMhr
VBIovic5l0xFkEHskAjFTevO86Fsz1C2aSeRKSqGFoOQ0tmJzBEs1R6KqnHInicD
TQrKhArgLXX4v3CddjfTRJkFWDbE/CkvKZNOrcf1nhaGCPspRJj2KUkj1Fhl9Cnc
dn/RsYEONbwQSjIfMPkvxF+8HQ==
-----END PRIVATE KEY-----`
export const publicKeyRsaPem = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAu1SU1LfVLPHCozMxH2Mo
4lgOEePzNm0tRgeLezV6ffAt0gunVTLw7onLRnrq0/IzW7yWR7QkrmBL7jTKEn5u
+qKhbwKfBstIs+bMY2Zkp18gnTxKLxoS2tFczGkPLPgizskuemMghRniWaoLcyeh
kd3qqGElvW/VDL5AaWTg0nLVkjRo9z+40RQzuVaE8AkAFmxZzow3x+VJYKdjykkJ
0iT9wCS0DRTXu269V264Vf/3jvredZiKRkgwlL9xNAwxXFg0x/XFw005UWVRIkdg
cKWTjpBP2dPwVZ4WWC+9aGVd+Gyn1o0CLelf4rEjGoXbAAEgAqeGUxrcIlbjXfbc
mwIDAQAB
-----END PUBLIC KEY-----`

describe('crypto/jwtVerify', function () {
  const publicRsaKey = crypto.createPublicKey({
    key: publicKeyRsaPem,
    format: 'pem',
    type: 'spki'
  })

  it('no token', function () {
    assert.deepEqual(jwtDecode(), {
      header: null,
      payload: null,
      parts: [undefined],
      headerPayload64: '.'
    })
  })

  it('HS256', function () {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'HS256',
          typ: 'JWT'
        },
        payload: {
          iat: 1516239022,
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )
    assert.strictEqual(
      verifySignature(decoded, { secret: 'your-256-bit-secret' }),
      true
    )
  })

  it('HS256 fails', function () {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'HS256',
          typ: 'JWT'
        },
        payload: {
          iat: 1516239022,
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )
    assert.strictEqual(
      verifySignature(decoded, { secret: 'your-256-bit-secret' }),
      false
    )
  })

  it('HS256 fails as being expired', function () {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTAwOTQyNzk0LCJleHAiOjE1MDA5NDM2OTR9.vkiODKNoppsyPSa6DDlqet-uyyTLpp_qr0VxXNZGKUY'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'HS256',
          typ: 'JWT'
        },
        payload: {
          name: 'John Doe',
          sub: '1234567890',
          iat: 1500942794,
          exp: 1500943694
        }
      }
    )
    try {
      verifySignature(decoded, { secret: 'your-256-bit-secret' })
      throw new Error('fail')
    } catch (err) {
      assert.equal(err.message, 'JWT expired')
    }
  })

  it('HS256 decodes with audience', function () {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJ0ZXN0Iiwic3ViIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiJKb2huIERvZSIsImlhdCI6MTUwMDk0Mjc5NH0.WTzahB3p_-1AGIBOU9sJIG7hrwRBUrsMuUtnkM-kNGs'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'HS256',
          typ: 'JWT'
        },
        payload: {
          aud: 'test',
          name: 'John Doe',
          sub: '1234567890',
          iat: 1500942794
        }
      }
    )
    assert.equal(
      verifySignature(decoded, {
        secret: 'your-256-bit-secret',
        audiences: ['test']
      }),
      true
    )

    try {
      verifySignature(decoded, {
        secret: 'your-256-bit-secret',
        audiences: []
      })
      throw new Error('fail')
    } catch (err) {
      assert.equal(err.message, 'bad audience')
    }
  })

  it('HS384', function () {
    const token =
      'eyJhbGciOiJIUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.8aMsJp4VGY_Ia2s9iWrS8jARCggx0FDRn2FehblXyvGYRrVVbu3LkKKqx_MEuDjQ'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'HS384',
          typ: 'JWT'
        },
        payload: {
          iat: 1516239022,
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )
    assert.strictEqual(
      verifySignature(decoded, { secret: 'your-384-bit-secret' }),
      true
    )
  })

  it('HS512', function () {
    const token =
      'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ._MRZSQUbU6G_jPvXIlFsWSU-PKT203EdcU388r5EWxSxg8QpB3AmEGSo2fBfMYsOaxvzos6ehRm4CYO1MrdwUg'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'HS512',
          typ: 'JWT'
        },
        payload: {
          iat: 1516239022,
          name: 'John Doe',
          sub: '1234567890'
        }
      }
    )
    assert.strictEqual(
      verifySignature(decoded, { secret: 'your-512-bit-secret' }),
      true
    )
  })

  it('RS256', async function () {
    const token =
      'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.Eci61G6w4zh_u9oOCk_v1M_sKcgk0svOmW4ZsL-rt4ojGUH2QY110bQTYNwbEVlowW7phCg7vluX_MCKVwJkxJT6tMk2Ij3Plad96Jf2G2mMsKbxkC-prvjvQkBFYWrYnKWClPBRCyIcG0dVfBvqZ8Mro3t5bX59IKwQ3WZ7AtGBYz5BSiBlrKkp6J1UmP_bFV3eEzIHEFgzRa3pbr4ol4TK6SnAoF88rLr2NhEz9vpdHglUMlOBQiqcZwqrI-Z4XDyDzvnrpujIToiepq9bCimPgVkP54VoZzy-mMSGbthYpLqsL_4MQXaI1Uf_wKFAUuAtzVn4-ebgsKOpvKNzVA'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'RS256',
          typ: 'JWT'
        },
        payload: {
          iat: 1516239022,
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

  it('RS384', async function () {
    const token =
      'eyJhbGciOiJSUzM4NCIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.o1hC1xYbJolSyh0-bOY230w22zEQSk5TiBfc-OCvtpI2JtYlW-23-8B48NpATozzMHn0j3rE0xVUldxShzy0xeJ7vYAccVXu2Gs9rnTVqouc-UZu_wJHkZiKBL67j8_61L6SXswzPAQu4kVDwAefGf5hyYBUM-80vYZwWPEpLI8K4yCBsF6I9N1yQaZAJmkMp_Iw371Menae4Mp4JusvBJS-s6LrmG2QbiZaFaxVJiW8KlUkWyUCns8-qFl5OMeYlgGFsyvvSHvXCzQrsEXqyCdS4tQJd73ayYA4SPtCb9clz76N1zE5WsV4Z0BYrxeb77oA7jJhh994RAPzCG0hmQ'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'RS384',
          typ: 'JWT'
        },
        payload: {
          iat: 1516239022,
          name: 'John Doe',
          admin: true,
          sub: '1234567890'
        }
      }
    )

    assert.strictEqual(
      verifySignature(decoded, { publicKey: publicRsaKey }),
      true
    )
  })

  it('RS512', async function () {
    const token =
      'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.jYW04zLDHfR1v7xdrW3lCGZrMIsVe0vWCfVkN2DRns2c3MN-mcp_-RE6TN9umSBYoNV-mnb31wFf8iun3fB6aDS6m_OXAiURVEKrPFNGlR38JSHUtsFzqTOj-wFrJZN4RwvZnNGSMvK3wzzUriZqmiNLsG8lktlEn6KA4kYVaM61_NpmPHWAjGExWv7cjHYupcjMSmR8uMTwN5UuAwgW6FRstCJEfoxwb0WKiyoaSlDuIiHZJ0cyGhhEmmAPiCwtPAwGeaL1yZMcp0p82cpTQ5Qb-7CtRov3N4DcOHgWYk6LomPR5j5cCkePAz87duqyzSMpCB0mCOuE3CU2VMtGeQ'

    const decoded = jwtDecode(token)
    const { header, payload } = decoded
    assert.deepStrictEqual(
      { header, payload },
      {
        header: {
          alg: 'RS512',
          typ: 'JWT'
        },
        payload: {
          iat: 1516239022,
          name: 'John Doe',
          admin: true,
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
