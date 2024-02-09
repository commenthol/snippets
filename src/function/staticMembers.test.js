import assert from 'assert'
import { getStaticMembers, getClassDescriptors } from './index.js'

describe('function/staticMembers', () => {
  class Foo {
    static get bar () {
      return 'foobar'
    }

    static bas () { }

    baz () {
      return 'foobaz'
    }
  }

  function Baz () {}

  it('getClassDescriptors', function () {
    const descriptors = getClassDescriptors(Foo)
    assert.deepStrictEqual(
      Object.entries(descriptors)
        .filter(([, descriptor]) => !descriptor.writable)
        .map(([name]) => name),
      ['length', 'name', 'prototype', 'bar']
    )
  })

  it('getStaticMembers Foo', function () {
    const members = getStaticMembers(Foo)
    assert.deepStrictEqual(
      members,
      ['bar', 'bas']
    )
  })

  it('getStaticMembers Baz', function () {
    const members = getStaticMembers(Baz)
    assert.deepStrictEqual(
      members,
      []
    )
  })
})
