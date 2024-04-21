import assert from 'assert'
import { random } from './random.js'

const RE = /^[0-9a-zA-Z_-]+$/
const RE_NO_DASHES = /^[0-9a-zA-Z]+$/

describe('string/random', function () {
  it('shall generate a random Id', function () {
    const id = random()
    assert.strictEqual(id.length, 21)
    assert.ok(RE.test(id), id)
    assert.notEqual(random(), id)
  })

  it('shall generate a random Id with length 40', function () {
    const id = random(40)
    assert.strictEqual(id.length, 40)
    assert.ok(RE.test(id))
  })

  it('shall generate a random Id with length 40 and no dashes', function () {
    const alphabet =
      '0123456789' +
      'abcdefghijklmnopqrstuvwxyz' +
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const id = random(40, alphabet)
    assert.strictEqual(id.length, 40)
    assert.ok(RE_NO_DASHES.test(id), id)
    assert.notEqual(random(40, alphabet), id)
  })
})
