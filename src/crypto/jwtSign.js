import * as crypto from 'node:crypto'
import { ms } from '../date/ms.js'

const toBase64 = (str = '') => Buffer.from(str).toString('base64url')
const stringify = (obj) => JSON.stringify(obj)

const seconds = (date = Date.now()) => Math.floor(date / 1000)

/**
 * @param {{ alg: string, [key: string]: string|number|undefined}} header
 * @param {object} payload payload to sign
 * @param {{
 *  expires?: number
 *  secret?: string
 *  key?: string | Buffer | crypto.PrivateKeyInput | crypto.JsonWebKeyInput | crypto.KeyObject
 * }} opts
 * @returns {string}
 * - expires: expires in milliseconds
 * - secret: secret for HS256/HS384/HS512
 * - key: private key for RS256/RS384/RS512
 */
export function jwtSign(header, payload, opts) {
  const { alg } = header
  const { expires = ms('15min'), secret, key } = opts || {}
  const algorithm = algMap[alg]
  if (!algorithm) {
    throw new TypeError(`unsupported algorithm "${alg}"`)
  }
  if (payload.iat === undefined) {
    payload.iat = seconds()
  }
  if (payload.exp === undefined) {
    payload.exp = seconds(Date.now() + (expires || 0))
  }
  const header64 = toBase64(stringify({ ...header, typ: 'JWT' }))
  const payload64 = toBase64(stringify(payload))
  const headerPayload64 = [header64, payload64].join('.')

  let signature = ''
  switch (alg.slice(0, 2)) {
    case 'HS': {
      if (!secret) {
        throw new TypeError('missing secret')
      }
      signature = crypto
        .createHmac(algorithm, secret)
        .update(headerPayload64)
        .digest('base64url')
      break
    }
    case 'RS': {
      if (!key) {
        throw new TypeError('missing key')
      }
      const keyObject =
        key instanceof crypto.KeyObject ? key : crypto.createPrivateKey(key)

      if (!keyObject || keyObject.asymmetricKeyType !== 'rsa') {
        throw new TypeError('Invalid key; asymmetricKeyType must be rsa')
      }
      if ((keyObject.asymmetricKeyDetails?.modulusLength || 0) < 2048) {
        throw new TypeError('Invalid key; modulusLength must >= 2048')
      }
      signature = crypto
        .sign(algorithm, Buffer.from(headerPayload64), keyObject)
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
  RS512: 'rsa-sha512',
}
