import assert from 'node:assert'
import { base64Encode, base64Decode } from './base64.js'

describe('string/base64', () => {
  const str = 'abc ABC Text 👏🏽 🇺🇳 👩🏼‍🦱'

  it('shall encode', () => {
    assert.strictEqual(base64Encode(str), Buffer.from(str).toString('base64'))
  })

  it('shall decode', () => {
    const b64Encoded = base64Encode(str)
    assert.strictEqual(
      base64Decode(b64Encoded),
      Buffer.from(Buffer.from(str).toString('base64'), 'base64').toString()
    )
  })
})
