import crypto from 'crypto'

const toBuffer = (base64 = '') => Buffer.from(base64, 'base64url')
const parse = buffer => JSON.parse(buffer || 'null')

/**
 * @param {string} token
 * @returns {{
 *  header: object|null
 *  payload: object|null
 *  headerPayloadB64: string
 *  parts: Buffer[]
 * }}
 */
export function jwtDecode (token = '', secret) {
  const partsB64 = token.split('.')
  const headerPayloadB64 = [partsB64[0], partsB64[1]].join('.')
  const parts = partsB64.map(part => part ? toBuffer(part) : undefined)
  const header = parse(parts[0])
  const payload = parse(parts[1])
  return { header, payload, headerPayloadB64, parts }
}

const algMap = {
  HS256: 'sha256',
  HS384: 'sha384',
  HS512: 'sha512',
  RS256: 'rsa-sha256',
  RS384: 'rsa-sha384',
  RS512: 'rsa-sha512'
}

const hash = buf => crypto.createHash('sha256').update(buf).digest()

/**
 * @param {{
 *  header: object|null
 *  payload?: object|null
 *  headerPayloadB64: string
 *  parts: Buffer[]
 * }} param0
 * @param {string|crypto.RsaPrivateKey} secret
 * @param {crypto.RsaPublicKey} publicKey
 * @returns {boolean}
 */
export function verifySignature ({ header, headerPayloadB64, parts }, secret, publicKey) {
  const { alg } = header
  const algorithm = algMap[alg]
  if (!algorithm) {
    throw new Error(`unsupported algorithm ${alg}`)
  }
  switch (alg.slice(0, 2)) {
    case 'HS': {
      const compare = crypto.createHmac(algorithm, secret)
        .update(headerPayloadB64).digest()
      return crypto.timingSafeEqual(hash(compare), hash(parts[2]))
    }
    case 'RS': {
      return crypto.verify(
        algorithm,
        headerPayloadB64,
        publicKey,
        parts[2]
      )
    }
  }
}
