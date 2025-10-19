import assert from 'assert'
import { isObject } from './index.js'

describe('object/isObject', function () {
  class Foo {}

  const tests = [
    [true, {}],
    [true, Object.create({}), 'Object.create({})'],
    [true, Object.create(null), 'Object.create(null)'],
    [true, Object.create(Object.prototype), 'Object.create(Object.prototype)'],
    [true, /regex/],
    [true, new Foo()],
    [false, 'string'],
    [false, 1],
    [false, () => {}],
    [false, [], '[]'],
    [false, [0, 1]],
    [false, undefined],
    [false, null],
  ]

  tests.forEach(([expected, value, title]) => {
    it(`should return ${expected} for ${title || value}`, function () {
      assert.strictEqual(isObject(value), expected)
    })
  })
})
