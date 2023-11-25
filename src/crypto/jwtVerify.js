import * as crypto from 'crypto'

const toBuffer = (base64 = '') => Buffer.from(base64, 'base64url')
const parse = (buffer) => JSON.parse(buffer || 'null')

/**
 * @param {string} token
 * @returns {{
 *  header: object|null
 *  payload: object|null
 *  headerPayload64: string
 *  parts: (Buffer|undefined)[]
 * }}
 */
export function jwtDecode (token) {
  const parts64 = String(token || '').split('.')
  const headerPayload64 = [parts64[0], parts64[1]].join('.')
  const parts = parts64.map((part) => (part ? toBuffer(part) : undefined))
  const header = parse(parts[0])
  const payload = parse(parts[1])
  return { header, payload, headerPayload64, parts }
}

const algMap = {
  HS256: 'sha256',
  HS384: 'sha384',
  HS512: 'sha512',
  RS256: 'rsa-sha256',
  RS384: 'rsa-sha384',
  RS512: 'rsa-sha512'
}

const hash = (buf) => crypto.createHash('sha256').update(buf).digest()

/**
 * @typedef {{
 *  secret?: string|crypto.RsaPrivateKey
 *  publicKey?: crypto.KeyLike
 *  audiences?: string[]
 * }} JwtVerifyOptions
 * - secret: HSxxx secret
 * - publicKey: RSxxx public key
 * - audiences: list of allowed audiences
 */

/**
 * @param {{
 *  header: object|null
 *  payload?: object|null
 *  headerPayload64: string
 *  parts: (Buffer|undefined)[]
 * }} decoded
 * @param {JwtVerifyOptions} options
 * @returns {boolean}
 */
export function verifySignature (decoded, options) {
  const { header, payload, headerPayload64, parts } = decoded
  const { audiences, secret, publicKey } = options
  const { alg } = header || {}
  const algorithm = algMap[alg]
  if (!algorithm) {
    throw new Error(`unsupported algorithm "${alg}"`)
  }
  if (!parts || !parts[2]) {
    throw new Error('missing signature')
  }
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('JWT expired')
  }
  if (audiences && !audiences.includes(payload.aud)) {
    throw new Error('bad audience')
  }
  switch (alg.slice(0, 2)) {
    case 'HS': {
      if (!secret) {
        throw new Error('missing secret')
      }
      const compare = crypto
        // @ts-expect-error
        .createHmac(algorithm, secret)
        .update(headerPayload64)
        .digest()
      return crypto.timingSafeEqual(hash(compare), hash(parts[2]))
    }
    case 'RS': {
      if (!publicKey) {
        throw new Error('missing publicKey')
      }
      const keyObject =
        publicKey instanceof crypto.KeyObject
          ? publicKey
          : crypto.createPublicKey(publicKey)
      return crypto.verify(
        algorithm,
        Buffer.from(headerPayload64),
        keyObject,
        parts[2]
      )
    }
    default:
      return false
  }
}

/**
 * @param {string} token
 * @param {JwtVerifyOptions} options
 * @returns {{ header: object, payload: object }|undefined}
 */
export function jwtVerify (token, options) {
  const decoded = jwtDecode(token)
  const isValid = verifySignature(decoded, options)
  if (!isValid) {
    return
  }
  const { header, payload } = decoded
  return { header, payload }
}
