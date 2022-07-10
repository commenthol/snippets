import assert from 'assert'
import { random64 } from './random64.js'

const RE = /^[0-9a-zA-Z_-]+$/

describe('string/random64', function () {
  it('shall generate a random Id', function () {
    const id = random64()
    assert.strictEqual(id.length, 21)
    assert(RE.test(id))
  })

  it('shall generate a random Id with length 40', function () {
    const id = random64(40)
    assert.strictEqual(id.length, 40)
    assert(RE.test(id))
  })
})
