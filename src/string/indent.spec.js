import assert from 'assert/strict'
import { indent } from './indent.js'

describe('string/indent', function () {
  it('shall indent line', function () {
    assert.equal(indent('hello world'), '    hello world')
  })
  it('shall indent block', function () {
    assert.equal(
      indent('first line\nsecond line\nthird line'),
      '    first line\n    second line\n    third line'
    )
  })
  it('shall indent block with first line', function () {
    assert.equal(
      indent('first line\nsecond line\nthird line', {
        spaces: 3,
        first: false
      }),
      'first line\n   second line\n   third line'
    )
  })
})
