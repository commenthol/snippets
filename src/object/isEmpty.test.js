import assert from 'assert'
import { isEmpty, isEmptyObj, isEmptyPrototype } from './index.js'

describe('object/isEmpty', () => {
  it('undefined', () => {
    assert.strictEqual(isEmpty(), true)
  })
  it('null', () => {
    assert.strictEqual(isEmpty(null), true)
  })
  it('empty object', () => {
    assert.strictEqual(isEmpty({}), true)
  })
  it('empty array', () => {
    assert.strictEqual(isEmpty([]), true)
  })
  it('object', () => {
    assert.strictEqual(isEmpty({ a: 1 }), false)
  })
  it('array', () => {
    assert.strictEqual(isEmpty([1]), false)
  })

  it('should work like lodash.isEmpty', function () {
    assert.strictEqual(isEmpty(true), true)
    assert.strictEqual(isEmpty(Array.prototype.slice), true)
    assert.strictEqual(isEmpty(1), true)
    assert.strictEqual(isEmpty(NaN), true)
    assert.strictEqual(isEmpty(/x/), true)
    assert.strictEqual(isEmpty(Symbol('')), true)
    assert.strictEqual(isEmpty(''), true)
    assert.strictEqual(isEmpty('abc'), false)
    assert.strictEqual(isEmpty(Buffer.from([])), true)
    assert.strictEqual(isEmpty(Buffer.from([1])), false)
  })

  it('should work with maps', function () {
    const map = new Map()
    assert.strictEqual(isEmpty(map), true)
    map.set('a', 1)
    assert.strictEqual(isEmpty(map), false)
    map.clear()
  })

  it('should work with sets', function () {
    const set = new Set()
    assert.strictEqual(isEmpty(set), true)
    set.add('a')
    assert.strictEqual(isEmpty(set), false)
    set.clear()
  })

  it('should work with an object that has a `length` property', function () {
    assert.strictEqual(isEmpty({ length: 0 }), false)
  })

  it('should work with `arguments` objects', function () {
    function toArgs(array) {
      return function () {
        return arguments
      }.apply(undefined, array)
    }
    const args = toArgs([1, 2, 3])
    assert.strictEqual(isEmpty(args), false)
  })

  // not compatible with lodash!
  it('does not work with prototype objects (use isEmptyPrototype instead)', function () {
    function Foo() {}
    Foo.prototype = { constructor: Foo }
    assert.strictEqual(isEmpty(Foo.prototype), false)

    Foo.prototype.a = 1
    assert.strictEqual(isEmpty(Foo.prototype), false)
  })

  it('should not treat objects with negative lengths as array-like', function () {
    function Foo() {}
    Foo.prototype.length = -1

    assert.strictEqual(isEmpty(new Foo()), true)
  })

  it('should not treat objects with lengths larger than `MAX_SAFE_INTEGER` as array-like', function () {
    function Foo() {}
    Foo.prototype.length = Number.MAX_SAFE_INTEGER + 1

    assert.strictEqual(isEmpty(new Foo()), true)
  })

  it('should not treat objects with non-number lengths as array-like', function () {
    assert.strictEqual(isEmpty({ length: '0' }), false)
  })
})

describe('object/isEmptyObj', () => {
  it('undefined', () => {
    assert.strictEqual(isEmptyObj(), true)
  })
  it('null', () => {
    assert.strictEqual(isEmptyObj(null), true)
  })
  it('empty object', () => {
    assert.strictEqual(isEmptyObj({}), true)
  })
  it('empty array', () => {
    assert.strictEqual(isEmptyObj([]), true)
  })
  it('object', () => {
    assert.strictEqual(isEmptyObj({ a: 1 }), false)
  })
  it('array', () => {
    assert.strictEqual(isEmptyObj([1]), false)
  })

  it('should work with an object that has a `length` property', function () {
    assert.strictEqual(isEmptyObj({ length: 0 }), false)
  })

  it('should work with `arguments` objects', function () {
    function toArgs(array) {
      return function () {
        return arguments
      }.apply(undefined, array)
    }
    const args = toArgs([1, 2, 3])
    assert.strictEqual(isEmptyObj(args), false)
  })

  // not compatible with lodash!
  it('does not work with prototype objects (use isEmptyObjPrototype instead)', function () {
    function Foo() {}
    Foo.prototype = { constructor: Foo }
    assert.strictEqual(isEmptyObj(Foo.prototype), false)

    Foo.prototype.a = 1
    assert.strictEqual(isEmptyObj(Foo.prototype), false)
  })

  it('should not treat objects with negative lengths as array-like', function () {
    function Foo() {}
    Foo.prototype.length = -1

    assert.strictEqual(isEmptyObj(new Foo()), true)
  })

  it('should not treat objects with lengths larger than `MAX_SAFE_INTEGER` as array-like', function () {
    function Foo() {}
    Foo.prototype.length = Number.MAX_SAFE_INTEGER + 1

    assert.strictEqual(isEmptyObj(new Foo()), true)
  })

  it('should not treat objects with non-number lengths as array-like', function () {
    assert.strictEqual(isEmptyObj({ length: '0' }), false)
  })
})

describe('object/isEmptyPrototype', () => {
  it('shall work with prototype objects', function () {
    function Foo() {}
    Foo.prototype = { constructor: Foo }
    assert.strictEqual(isEmptyPrototype(Foo.prototype), true)

    Foo.prototype.a = 1
    assert.strictEqual(isEmptyPrototype(Foo.prototype), false)
  })
})
