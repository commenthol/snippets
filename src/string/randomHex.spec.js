import assert from 'assert'
import { randomHex, fastRandomHex } from './index.js'

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

  it('should return a random hex string', function () {
    const one = fastRandomHex()
    const two = fastRandomHex()
    assert.ok(one !== two)
    // console.log(one, one.length)
    assert.strictEqual(one.length, 13)
  })

  it('benchmark', function () {
    /* eslint-disable no-console */
    const count = 1e5
    console.time('randomHex')
    for (let i = 0; i < count; i++) randomHex()
    console.timeEnd('randomHex')
    console.time('fastRandomHex')
    for (let i = 0; i < count; i++) fastRandomHex()
    console.timeEnd('fastRandomHex')
    /* eslint-ensable */
  })
})
