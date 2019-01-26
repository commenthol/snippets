import assert from 'assert'
import { randomHex } from '../../src/string'

describe('string/randomHex', () => {
  it('should only contain hexadecimal digits', () => {
    assert.ok(/^[0-9a-f]+$/.test(randomHex()))
  })
  it('length should be 16', () => {
    assert.ok(randomHex().length, 16)
  })
  it('length should be 50', () => {
    assert.ok(randomHex(50).length, 50)
  })
  it('should be different between calls', () => {
    const one = randomHex()
    const two = randomHex()
    assert.ok(one !== two)
  })
})
