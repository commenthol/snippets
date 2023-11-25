import crypto from 'crypto'
import { ms } from '../date/ms.js'

const toBase64 = (str = '') => Buffer.from(str).toString('base64url')
const stringify = (obj) => JSON.stringify(obj)

const seconds = (date = Date.now()) => Math.floor(date / 1000)

/**
 * @param {string} alg algorithm
 * @param {object} payload payload to sign
 * @param {{
 *  expires?: number
 *  secret?: string
 *  key?: crypto.KeyLike
 * }} opts
 * @returns {string}
 * - expires: expires in milliseconds
 * - secret: secret for HS256/HS384/HS512
 * - key: private key for RS256/RS384/RS512
 */
export function jwtEncode (alg, payload, opts) {
  const { expires = ms('15min'), secret, key } = opts || {}
  const algorithm = algMap[alg]
  if (!algorithm) {
    throw new Error(`unsupported algorithm ${alg}`)
  }
  if (payload.iat === undefined) {
    payload.iat = seconds()
  }
  if (payload.exp === undefined) {
    payload.exp = seconds(Date.now() + expires)
  }
  const header64 = toBase64(stringify({ alg, typ: 'JWT' }))
  const payload64 = toBase64(stringify(payload))
  const headerPayload64 = [header64, payload64].join('.')

  let signature = ''
  switch (alg.slice(0, 2)) {
    case 'HS': {
      signature = crypto
        .createHmac(algorithm, secret)
        .update(headerPayload64)
        .digest('base64url')
      break
    }
    case 'RS': {
      signature = crypto
        .sign(algorithm, headerPayload64, key)
        .toString('base64url')
      break
    }
  }

  return [header64, payload64, signature].join('.')
}

const algMap = {
  HS256: 'sha256',
  HS384: 'sha384',
  HS512: 'sha512',
  RS256: 'rsa-sha256',
  RS384: 'rsa-sha384',
  RS512: 'rsa-sha512'
}
