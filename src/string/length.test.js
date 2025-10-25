import assert from 'node:assert'
import { length } from './length.js'

const test = (str, expStrLen = 1) => {
  assert.strictEqual(length(str), 1)
  assert.strictEqual(str.length, expStrLen)
}

describe('string/length', function () {
  it('U+0041 LATIN CAPITAL LETTER A', function () {
    test('A')
  })

  it('U+1D400 MATHEMATICAL BOLD CAPITAL A', function () {
    test('𝐀', 2)
  })

  it('U+1F4A9 PILE OF POO', function () {
    test('💩', 2)
  })
})
