import assert from 'node:assert'
import { toPlainObject } from './index.js'

function Foo() {
  this.b = 2
}
Foo.prototype.c = 3

describe('object/toPlainObject', function () {
  it('instance to object', function () {
    assert.deepStrictEqual(toPlainObject(new Foo()), { b: 2, c: 3 })
  })

  it('object assignment wo conversion', function () {
    assert.deepStrictEqual(Object.assign({ a: 1 }, new Foo()), { a: 1, b: 2 })
  })

  it('object assignment shall preserve prototypes', function () {
    assert.deepStrictEqual(Object.assign({ a: 1 }, toPlainObject(new Foo())), {
      a: 1,
      b: 2,
      c: 3,
    })
  })
})
