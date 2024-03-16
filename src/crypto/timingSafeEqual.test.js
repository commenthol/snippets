import assert from 'node:assert/strict'
import { timingSafeEqual, timingSafeEqualNode } from './timingSafeEqual.js'

const fill = (char = 'a', count = 100) => new Array(count).fill(char).join('')

const testset = (timingSafeEqual, name) => {
  describe(`crypto/${name}`, function () {
    it('a === a', function () {
      assert.ok(timingSafeEqual('a', 'a'))
    })
    it('empty string "a" is false', function () {
      assert.ok(!timingSafeEqual('', 'b'))
    })
    it('empty string "b" is false', function () {
      assert.ok(!timingSafeEqual('a', ''))
    })
    it('a !== b', function () {
      assert.ok(!timingSafeEqual('a', 'b'))
    })
    it('1 !== b', function () {
      assert.ok(!timingSafeEqual(1, 'b'))
    })
    it('a(100) === a(100)', function () {
      assert.ok(timingSafeEqual(fill('a', 100), fill('a', 100)))
    })
    it('a(100) !== a(99)b', function () {
      assert.ok(!timingSafeEqual(fill('a', 100), fill('a', 99) + 'b'))
    })
    it('a(100) !== a(99)', function () {
      assert.ok(!timingSafeEqual(fill('a', 100), fill('a', 99)))
    })
  })
}

testset(timingSafeEqual, 'timingSafeEqual')
testset(timingSafeEqualNode, 'timingSafeEqualNode')
