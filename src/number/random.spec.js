import assert from 'assert'
import { random } from './index.js'

const assertRange = (result, expLower, expUpper, isInteger) => {
  assert(result >= expLower, 'lower bound assertion')
  assert(result <= expUpper, 'upper bound assertion')
  if (isInteger) {
    assert(Number.isSafeInteger(result), 'not an integer')
  } else {
    assert(!!(result % 1), 'not a float')
  }
}

describe('number/random', function () {
  it('no args', function () {
    assertRange(random(), 0, 1, true)
  })

  it('upper range', function () {
    assertRange(random(5), 0, 5, true)
  })

  it('lower & upper range', function () {
    assertRange(random(10, 50), 10, 50, true)
  })

  it('float: no args', function () {
    assertRange(random(true), 0, 1)
  })

  it('float: no args', function () {
    assertRange(random(true), 0, 1)
  })

  it('float: upper range float', function () {
    assertRange(random(1.2), 0, 1.2)
  })

  it('float: upper range int', function () {
    assertRange(random(2, true), 0, 2)
  })

  it('float: lower & upper range float', function () {
    assertRange(random(5, 12.2), 5, 12.2)
  })

  it('float: lower & upper range int', function () {
    assertRange(random(2, 10, true), 2, 10)
  })
})
